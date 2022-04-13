import { Inject, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Watcher, WatcherDocument } from '@/watchers/watcher.schema'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { Model, QueryOptions } from 'mongoose'
import { FindAllWatchersDto } from '@/watchers/dto/find-all-watchers.dto'
import { User, UserDocument } from '@/users/user.schema'
import { EmailService } from '@/email/email.service'
import { Listing, ListingDocument } from '@/listings/listing.schema'
import { ListingsService } from '@/listings/listings.service'
import Email from 'email-templates'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'

@Injectable()
export class WatchersService {
    constructor(
        @InjectModel(Watcher.name) private watcherModel: Model<WatcherDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Listing.name) private listingModel: Model<ListingDocument>,
        @Inject(EmailService) private readonly emailService: EmailService,
        @Inject(ListingsService) private readonly listingsService: ListingsService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

    async exists(metadata: CreateWatcherDto['metadata']) {
        const count = await this.watcherModel.count({ metadata })
        return count === 0 ? false : true
    }

    async create(createWatcherDto: CreateWatcherDto) {
        const watcher = await this.watcherModel.create(createWatcherDto)

        return watcher.save()
    }

    async findAll(query: FindAllWatchersDto) {
        const { limit } = query
        const options: QueryOptions = {}

        if (limit) options.limit = +limit

        const watchers = await this.watcherModel.find({}, undefined, options)

        return watchers
    }

    async findOne(id: number) {
        return await this.watcherModel.findById(id)
    }

    async update(id: number, updateWatcherDto: UpdateWatcherDto) {
        return await this.watcherModel.updateOne({ _id: id }, updateWatcherDto)
    }

    async remove(id: number) {
        await this.watcherModel.deleteOne({ _id: id })
    }

    @Cron('* * 9 * * *')
    async notifyAll() {
        const watcherCount = await this.watcherModel.countDocuments()
        let watcher: WatcherDocument
        let lastObjectId: string | undefined

        let i = 0
        while (watcherCount > i) {
            if (lastObjectId) {
                watcher = await this.watcherModel
                    .findOne({ _id: { $gt: lastObjectId } })
                    .sort({ _id: 1 })
            } else {
                watcher = await this.watcherModel.findOne().sort({ _id: 1 })
            }

            await this.notifyUsersInWatcher(watcher)

            lastObjectId = watcher._id.toString()
            i += 1
        }
    }

    async notifyUsersInWatcher(watcherOrId: string | WatcherDocument) {
        const watcher =
            typeof watcherOrId === 'string'
                ? await this.watcherModel.findById(watcherOrId)
                : watcherOrId

        const users = watcher.users

        for (const user of users) {
            await this.notifyUserOfWatcher(user.toString(), watcher)
        }
    }

    /**
     * Notify a user of watcher
     * @param userId - id of user
     * @param watcherOrId - either id of watcher or watcher document
     * @returns true if user was notified, else false
     */
    async notifyUserOfWatcher(
        userId: string,
        watcherOrId: string | WatcherDocument
    ): Promise<boolean> {
        const user = await this.userModel.findById(userId)
        const transporter = await this.emailService.transporter()
        const watcher = (
            typeof watcherOrId === 'string'
                ? await this.watcherModel.findById(watcherOrId)
                : watcherOrId
        ) as WatcherDocument

        if (!(await this.shouldNotifyUser(user, watcher._id))) {
            return false
        }

        const { filters } = this.listingsService.createMongoFilters(watcher.metadata)

        const newListings = await this.listingModel.find(filters, undefined, {
            limit: 7,
            lean: true,
        })

        if (newListings.length >= this.configService.get('notification.watcher.minListings')) {
            const email = new Email({
                message: {
                    from: this.emailService.googleAuth.email,
                },
                transport: transporter,
                preview: true,
            })


            const emailInfo = await email.send({
                template: this.emailService.templates.newItems,
                message: {
                    to: user.email,
                },
                locals: {
                    newItemCount: await this.listingModel.count(filters),
                    keyword: watcher.metadata.keyword,
                    items: newListings
                }
            })
            await transporter.sendMail(emailInfo.originalMessage)

            await this.userModel.findByIdAndUpdate(
                user._id,
                {
                    $set: {
                        'watchers.$[elem].notifiedAt': new Date(),
                    },
                },
                {
                    arrayFilters: [
                        {
                            'elem._id': watcher._id,
                        },
                    ],
                }
            )

            return true
        } else {
            return false
        }
    }

    async shouldNotifyUser(userOrId: string | UserDocument, watcherId: string): Promise<boolean> {
        const user =
            typeof userOrId === 'string' ? await this.userModel.findById(userOrId) : userOrId

        const userWatcher = user.watchers.id(watcherId)

        if (
            Date.now() - new Date(userWatcher.notifiedAt || userWatcher.createdAt).getTime() >=
            this.configService.get('notification.watcher.interval')
        ) {
            return true
        } else {
            return false
        }
    }
}
