import { ConflictException, HttpStatus, Injectable } from '@nestjs/common'
import { Error } from '@wille430/common'
import { CreateUserWatcherDto } from './dto/create-user-watcher.dto'
import { UpdateUserWatcherDto } from './dto/update-user-watcher.dto'
import { WatchersService } from '@/watchers/watchers.service'
import { UserWatchersRepository } from './user-watchers.repository'
import { WatchersRepository } from '@/watchers/watchers.repository'
import { UsersRepository } from '@/users/users.repository'
import { Watcher } from '@/schemas/watcher.schema'
import mongoose from 'mongoose'

@Injectable()
export class UserWatchersService {
    constructor(
        private watchersService: WatchersService,
        private readonly userWatchersRepository: UserWatchersRepository,
        private readonly watchersRepository: WatchersRepository,
        private readonly usersRepository: UsersRepository
    ) {}

    async create({ userId, metadata }: CreateUserWatcherDto) {
        let watcher = await this.watchersRepository.findOne({ metadata })

        // 1. Create new watcher if watcher doesn't exist already
        if (!watcher) {
            watcher = await this.watchersRepository.create({ metadata })
        }

        // 2. Append user watcher to user
        const user = await this.usersRepository.findById(userId)
        if (!user) return null

        // 2. If user is already subscribed to the watcher, throw error
        if (
            await this.userWatchersRepository.count({
                userId: user.id,
                watcherId: watcher.id,
            })
        ) {
            throw new ConflictException({
                statusCode: HttpStatus.CONFLICT,
                message: ['You are already subscribed to a similar watcher'],
                error: Error.Database.CONFLICTING_RESOURCE,
            })
        } else {
            const userWatcher = await this.userWatchersRepository.create({
                user: user,
                watcher: watcher,
            })

            return userWatcher
        }
    }

    async findAll(userId: string) {
        try {
            return await this.userWatchersRepository.find({
                user: userId,
            })
        } catch (e) {
            return []
        }
    }

    async findOne(id: string, userId: string) {
        const userWatcher = await this.userWatchersRepository.findOne({
            id: id,
            user: new mongoose.Types.ObjectId(userId),
        })

        await userWatcher?.populate('watcher')

        return userWatcher
    }

    async update(id: string, { userId, metadata }: UpdateUserWatcherDto) {
        const oldUserWatcher = await this.userWatchersRepository.findById(id)
        let watcher: Watcher

        if (await this.watchersService.exists(metadata)) {
            watcher = (await this.watchersRepository.findOne({
                metadata,
            }))!
        } else {
            watcher = await this.watchersService.create({
                metadata,
            })
        }

        await this.userWatchersRepository.findByIdAndUpdate(id, {
            $set: {
                watcher: watcher,
            },
        })

        if (
            oldUserWatcher &&
            (await this.watchersService.subscriberCount(oldUserWatcher.watcher.id)) === 0
        ) {
            await this.watchersService.remove(oldUserWatcher.watcher.id)
        }

        return this.findOne(id, userId)
    }

    /**
     * Unsubscribe a user from a watcher
     *
     * @param id - The id of the user watcher
     * @param userId - The id of the user
     * @returns True if the user watcher was deleted, else false
     */
    async remove(id: string, userId: string): Promise<boolean> {
        const { id: watcherId } =
            (await this.userWatchersRepository.findOne({
                id,
                userId,
            })) ?? {}
        if (!watcherId) return false

        // delete from user
        await this.userWatchersRepository.deleteMany({
            id,
            userId,
        })

        // delete watcher if no one is subscribed

        const subCount = await this.watchersService.subscriberCount(watcherId)

        if (subCount <= 0) {
            await this.watchersRepository.findByIdAndDelete(watcherId)
        }

        return true
    }
}
