import { ConflictException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { Model, PipelineStage } from 'mongoose'
import { User } from '@/users/user.schema'
import { PopulatedWatcher, Watcher, WatcherDocument } from '@/watchers/watcher.schema'
import { Document } from 'mongoose'
import { WatchersService } from '@/watchers/watchers.service'
import { ObjectId } from 'mongodb'
import { Error } from '@mewi/common'

@Injectable()
export class UserWatchersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        @InjectModel(Watcher.name) private watcherModel: Model<Watcher>,
        private watchersService: WatchersService
    ) {}

    async create({ userId, metadata }: CreateUserWatcherDto): Promise<PopulatedWatcher> {
        let watcher: WatcherDocument

        // 1. Check if watcher with same metadata exists
        if (await this.watchersService.exists(metadata)) {
            watcher = await this.watcherModel.findOne({ metadata })
        } else {
            // 2. If false, create watcher
            watcher = await this.watcherModel.create({ metadata })
        }

        // 3. Append user watcher to user
        const user = await this.userModel.findById(userId)
        const userWatcher = user.watchers.create({ _id: watcher._id })

        user.watchers.addToSet(userWatcher)
        const addedWatcher = watcher.users.addToSet(user._id)

        if (!addedWatcher.length) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: ['You are already subscribed to a similar watcher'],
                error: Error.Database.CONFLICTING_RESOURCE,
            })
        }

        await user.save()
        await watcher.save()

        return {
            ...user.watchers.id(watcher._id).toJSON(),
            metadata,
        }
    }

    async findAll(userId: string): Promise<PopulatedWatcher[]> {
        const pipeline: PipelineStage[] = [
            { $limit: 1 },
            {
                $match: { _id: new ObjectId(userId) },
            },
            {
                $unwind: {
                    path: '$watchers',
                },
            },
            {
                $group: {
                    _id: '$_id',
                    watchers: {
                        $push: '$watchers',
                    },
                },
            },
            {
                $lookup: {
                    from: 'watchers',
                    localField: 'watchers._id',
                    foreignField: '_id',
                    as: 'watchers',
                },
            },
        ]

        try {
            const agg = await this.userModel.aggregate(pipeline)
            return agg[0].watchers as PopulatedWatcher[]
        } catch (e) {
            return []
        }
    }

    async findOne(id: string, userId: string): Promise<PopulatedWatcher & Document> | undefined {
        try {
            // TODO: dont return users
            const agg = await this.userModel.aggregate([
                { $limit: 1 },
                {
                    $match: { _id: new ObjectId(userId) },
                },
                {
                    $unwind: {
                        path: '$watchers',
                    },
                },
                { $match: { 'watchers._id': new ObjectId(id) } },
                {
                    $lookup: {
                        from: 'watchers',
                        localField: 'watchers._id',
                        foreignField: '_id',
                        as: 'watchers.watcher',
                    },
                },
                {
                    $group: {
                        _id: '$_id',
                        watchers: {
                            $push: '$watchers',
                        },
                    },
                },
            ])

            const watcher = agg[0].watchers[0]

            return watcher
        } catch (e) {
            return undefined
        }
    }

    async update(id: string, { userId, metadata }: UpdateUserWatcherDto) {
        this.remove(id, userId)
        this.create({ metadata, userId })
    }

    async remove(id: string | ObjectId, userId: string | ObjectId) {
        id = new ObjectId(id)
        userId = new ObjectId(userId)

        // delete from user
        await this.userModel.updateOne({ _id: userId }, { $pull: { watchers: { _id: id } } })

        // delete from watcher
        await this.watcherModel.updateOne({ _id: id }, { $pull: { users: userId } })

        if (!(await this.watcherModel.findById(id)).users.length) {
            this.watcherModel.deleteOne({ _id: id })
        }
    }
}
