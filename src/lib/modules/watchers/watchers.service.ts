import { autoInjectable, inject } from 'tsyringe'
import { ObjectId } from 'mongodb'
import { EJSON } from 'bson'
import Email from 'email-templates'
import { WatchersRepository } from './watchers.repository'
import type { CreateWatcherDto } from './dto/create-watcher.dto'
import type { FindAllWatchersDto } from './dto/find-all-watchers.dto'
import type { UpdateWatcherDto } from './dto/update-watcher.dto'
import { EmailService } from '../email/email.service'
import { ListingsRepository } from '../listings/listings.repository'
import { ListingsService } from '../listings/listings.service'
import { UserWatchersRepository } from '../user-watchers/user-watchers.repository'
import { UsersRepository } from '../users/users.repository'
import type { User } from '../schemas/user.schema'
import type { WatcherDocument } from '../schemas/watcher.schema'
import { ListingSearchFilters } from '@/common/types'

@autoInjectable()
export class WatchersService {
    constructor(
        @inject(WatchersRepository) private readonly watchersRepository: WatchersRepository,
        @inject(UserWatchersRepository)
        private readonly userWatchersRepository: UserWatchersRepository,
        @inject(UsersRepository) private readonly usersRepository: UsersRepository,
        @inject(ListingsRepository) private readonly listingsRepository: ListingsRepository,
        @inject(EmailService) private readonly emailService: EmailService,
        @inject(ListingsService) private readonly listingService: ListingsService
    ) {}

    config = {
        notifications: {
            interval: 2.5 * 24 * 60 * 60 * 1000,
            listingCount: 7,
            minListings: 1,
        },
    }

    async exists(metadata: CreateWatcherDto['metadata']) {
        const count = await this.watchersRepository.count({ metadata })
        return count !== 0
    }

    async create(createWatcherDto: CreateWatcherDto) {
        const watcher = await this.watchersRepository.create(createWatcherDto)

        return watcher
    }

    async findAll(query: FindAllWatchersDto) {
        const { limit } = query
        const options: any = {}

        if (limit) options.take = +limit

        const watchers = await this.watchersRepository.find({
            ...options,
        })

        return watchers
    }

    async findOne(id: string) {
        return await this.watchersRepository.findById(id)
    }

    async update(id: string, updateWatcherDto: UpdateWatcherDto) {
        return await this.watchersRepository.findByIdAndUpdate(id, { $set: updateWatcherDto })
    }

    async remove(id: string) {
        await this.watchersRepository.findByIdAndDelete(id)
    }

    async notifyAll() {
        const watcherCount = await this.watchersRepository.count({})

        let i = 0
        while (watcherCount > i) {
            const watcher = await this.watchersRepository.findOne({
                skip: i,
                orderBy: { id: 'asc' },
            })

            if (watcher) await this.notifyUsersInWatcher(watcher)

            i += 1
        }
    }

    /**
     * Fetch all users that are subscribed to watcher
     *
     * @param watcherId - The id of the watcher
     * @returns An array of user ids
     */
    async getUsersInWatcher(watcherId: string): Promise<User[]> {
        const aggregation = [
            {
                $match: {
                    watcher: new ObjectId(watcherId),
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: {
                    path: '$user',
                },
            },
            { $project: { user: '$user' } },
        ]
        const res = await this.userWatchersRepository.aggregate(aggregation)
        return res.map(({ user }) => user)
    }

    async notifyUsersInWatcher(watcherOrId: string | WatcherDocument) {
        const watcher =
            typeof watcherOrId === 'string'
                ? await this.watchersRepository.findById(watcherOrId)
                : watcherOrId

        if (!watcher) return

        const users = await this.getUsersInWatcher(watcher.id)

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
        const transporter = await this.emailService.transporter()

        const watcher =
            typeof watcherOrId === 'string'
                ? await this.watchersRepository.findById(watcherOrId)
                : watcherOrId

        if (!watcher) return false

        if (!(await this.shouldNotifyUser(userId, watcher.id))) {
            return false
        }

        const user = (await this.usersRepository.findById(userId)) as User

        const pipeline = this.listingService.metadataToPL(
            watcher.metadata as Partial<ListingSearchFilters>
        )

        const newListings = await this.newListings(pipeline)

        if (newListings.length >= this.config.notifications.minListings) {
            const email = new Email({
                message: {
                    from: this.emailService.credentials.email,
                },
                transport: transporter,
            })

            const locals = {
                newItemCount: await this.listingsRepository
                    .aggregate([
                        ...this.listingService.metadataToPL(watcher.metadata as any),
                        { $count: 'totalHits' },
                    ])
                    .then((res) => (res as any)[0]?.totalHits ?? 0),
                keyword: watcher.metadata.keyword,
                items: newListings,
            }

            const emailInfo = await email.send({
                template: this.emailService.templates.newItems,
                message: {
                    to: user.email,
                },
                locals: locals,
            })
            await transporter.sendMail(emailInfo.originalMessage)

            // TODO:
            // Save email record
            // await this.prisma.emailRecord.create({
            //     data: {
            //         from: this.emailService.credentials.email,
            //         to: user.email,
            //         userId: user.id,
            //         type: EmailType.WATCHER,
            //     },
            // })

            // Set new notifiedAt date
            await this.userWatchersRepository.findOneAndUpdate(
                {
                    userId: user.id,
                    watcherId: watcher.id,
                },
                {
                    notifiedAt: new Date(),
                }
            )

            return true
        } else {
            return false
        }
    }

    async newListings(pipeline: any) {
        return await this.listingsRepository
            .aggregate([...pipeline, { $limit: 7 }])
            .then((arr: any) => (arr as unknown as any[]).map((x) => EJSON.deserialize(x)))
    }

    async shouldNotifyUser(userId: string, watcherId: string): Promise<boolean> {
        const userWatcher = await this.userWatchersRepository.findOne({
            userId,
            watcherId,
        })

        if (!userWatcher) return false

        if (
            Date.now() - new Date(userWatcher.notifiedAt || userWatcher.createdAt).getTime() >=
            this.config.notifications.interval
        ) {
            return true
        } else {
            return false
        }
    }

    async subscriberCount(watcherId: string): Promise<number> {
        return this.userWatchersRepository.count({
            watcher: new ObjectId(watcherId),
        })
    }
}
