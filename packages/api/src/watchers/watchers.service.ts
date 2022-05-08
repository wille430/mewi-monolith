import { Inject, Injectable } from '@nestjs/common'
import { CreateWatcherDto } from './dto/create-watcher.dto'
import { UpdateWatcherDto } from './dto/update-watcher.dto'
import { FindAllWatchersDto } from '@/watchers/dto/find-all-watchers.dto'
import { EmailService } from '@/email/email.service'
import Email from 'email-templates'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, User, Watcher } from '@prisma/client'
import { ListingsService } from '@/listings/listings.service'

@Injectable()
export class WatchersService {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(EmailService) private readonly emailService: EmailService,
        @Inject(ListingsService) private readonly listingService: ListingsService,
        @Inject(ConfigService) private configService: ConfigService
    ) {}

    async exists(metadata: CreateWatcherDto['metadata']) {
        const count = await this.prisma.watcher.count({ where: { metadata } })
        return count === 0 ? false : true
    }

    async create(createWatcherDto: CreateWatcherDto) {
        const watcher = await this.prisma.watcher.create({ data: createWatcherDto })

        return watcher
    }

    async findAll(query: FindAllWatchersDto) {
        const { limit } = query
        const options: Prisma.WatcherFindManyArgs = {}

        if (limit) options.take = +limit

        const watchers = await this.prisma.watcher.findMany({
            ...options,
        })

        return watchers
    }

    async findOne(id: string) {
        return await this.prisma.watcher.findUnique({ where: { id } })
    }

    async update(id: string, updateWatcherDto: UpdateWatcherDto) {
        return await this.prisma.watcher.update({ where: { id }, data: updateWatcherDto })
    }

    async remove(id: string) {
        await this.prisma.watcher.findUnique({ where: { id } })
    }

    @Cron('* * 9 * * *')
    async notifyAll() {
        const watcherCount = await this.prisma.watcher.count()
        let watcher: Watcher | null

        let i = 0
        while (watcherCount > i) {
            watcher = await this.prisma.watcher.findFirst({
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
    async getUsersInWatcher(watcherId: string) {
        return (
            await this.prisma.userWatcher.groupBy({
                by: ['userId'],
                where: {
                    watcherId,
                },
            })
        ).map((x) => x.userId)
    }

    async notifyUsersInWatcher(watcherOrId: string | Watcher) {
        const watcher =
            typeof watcherOrId === 'string'
                ? await this.prisma.watcher.findUnique({ where: { id: watcherOrId } })
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
    async notifyUserOfWatcher(userId: string, watcherOrId: string | Watcher): Promise<boolean> {
        const transporter = await this.emailService.transporter()

        const watcher =
            typeof watcherOrId === 'string'
                ? await this.prisma.watcher.findUnique({ where: { id: watcherOrId } })
                : watcherOrId

        if (!watcher) return false

        if (!(await this.shouldNotifyUser(userId, watcher.id))) {
            return false
        }

        await this.prisma.listing.findMany({
            where: {
                price: {
                    value: {
                        gt: 10,
                    },
                } as any,
            },
        })

        const user = (await this.prisma.user.findUnique({ where: { id: userId } })) as User

        // const { filters } = this.listingsService.createMongoFilters(watcher.metadata)

        // TODO
        const newListings = await this.prisma.listing.findMany({
            where: {
                ...(watcher.metadata as any),
            },
            take: 7,
        })

        if (newListings.length >= this.configService.get('notification.watcher.minListings')) {
            const email = new Email({
                message: {
                    from: this.emailService.googleAuth.email,
                },
                transport: transporter,
            })

            const emailInfo = await email.send({
                template: this.emailService.templates.newItems,
                message: {
                    to: user.email,
                },
                locals: {
                    newItemCount: await this.prisma.listing.count({
                        where: this.listingService.metadataToWhereInput(watcher.metadata as any)[
                            'where'
                        ],
                    }),
                    keyword: watcher.metadata.keyword,
                    items: newListings,
                },
            })
            await transporter.sendMail(emailInfo.originalMessage)

            // Set new notifiedAt date
            await this.prisma.userWatcher.updateMany({
                where: {
                    userId: user.id,
                    watcherId: watcher.id,
                },
                data: {
                    notifiedAt: new Date(),
                },
            })

            return true
        } else {
            return false
        }
    }

    async shouldNotifyUser(userId: string, watcherId: string): Promise<boolean> {
        const userWatcher = await this.prisma.userWatcher.findFirst({
            where: {
                userId,
                watcherId,
            },
        })

        if (!userWatcher) return false

        if (
            Date.now() - new Date(userWatcher.notifiedAt || userWatcher.createdAt).getTime() >=
            this.configService.get('notification.watcher.interval')
        ) {
            return true
        } else {
            return false
        }
    }

    async subscriberCount(watcherId: string): Promise<number> {
        return (
            (await this.prisma.userWatcher.count({
                where: {
                    watcherId,
                },
            })) ?? 0
        )
    }
}
