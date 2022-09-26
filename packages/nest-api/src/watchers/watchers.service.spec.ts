import { Test, TestingModule } from '@nestjs/testing'
import { ListingFactory, UserFactory, WatcherFactory } from '@mewi/test-utils'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Transporter } from 'nodemailer'
import { User } from '@mewi/prisma'
import { WatchersService } from './watchers.service'
import { EmailModule } from '../email/email.module'
import configuration from '../config/configuration'
import { EmailService } from '../email/email.service'
import { ListingsModule } from '../listings/listings.module'
import notificationConfig from '../config/notification.config'
import { PrismaService } from '../prisma/prisma.service'
import _ from 'lodash'

describe('WatchersService', () => {
    let watchersService: WatchersService
    let emailService: EmailService
    let configService: ConfigService
    let prisma: PrismaService

    let mockTransporter: Transporter

    let user: User

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                EmailModule,
                ListingsModule,
                ConfigModule.forRoot({ load: [configuration, notificationConfig] }),
            ],
            providers: [WatchersService, PrismaService],
        }).compile()

        watchersService = module.get<WatchersService>(WatchersService)
        emailService = module.get<EmailService>(EmailService)
        configService = module.get<ConfigService>(ConfigService)
        prisma = module.get<PrismaService>(PrismaService)

        for (let i = 0; i < 20; i++) {
            await prisma.listing.create({
                data: ListingFactory.build({
                    date: new Date().toISOString(),
                }),
            })
        }
    })

    beforeEach(async () => {
        // Create a user, a watcher, and subscribe the user to that watcher

        user = await UserFactory.create()

        // await prisma.userWatcher.create({
        //     data: UserWatcherFactory.build({
        //         notifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 10000),
        //     }),
        // })

        mockTransporter = await emailService.transporter()
        mockTransporter.sendMail = jest.fn()
        emailService.transporter = jest.fn().mockResolvedValue(mockTransporter)
    })

    afterEach(async () => {
        jest.clearAllMocks()
    })

    afterAll(async () => {
        await prisma.userWatcher.deleteMany()
        await prisma.user.deleteMany()
        await prisma.watcher.deleteMany()
        await prisma.listing.deleteMany()

        await prisma.$disconnect()
    })

    it('should be defined', () => {
        expect(watchersService).toBeTruthy()
    })

    describe('#notifyUserOfWatcher', () => {
        it('should send email to user and update user watcher', async () => {
            let userWatcher = await prisma.userWatcher.findFirst({ where: { userId: user.id } })

            if (!userWatcher)
                throw new Error(
                    `Could not find a watcher thar user with id ${user.id} is subscribed to`
                )

            watchersService.shouldNotifyUser = jest.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.watcherId)

            expect(mockTransporter.sendMail).toBeCalledTimes(1)

            // Get updated data
            user = (await prisma.user.findUnique({
                where: { id: user.id },
            }))!

            userWatcher = await prisma.userWatcher.findFirst({
                where: {
                    userId: user.id,
                },
            })

            expect(userWatcher).toHaveProperty('notifiedAt')
            expect(userWatcher?.notifiedAt?.getTime()).toBeGreaterThan(Date.now() - 10 * 1000)
        })

        it('should not send email to user if no new listings were found', async () => {
            jest.spyOn(prisma.listing, 'findMany').mockResolvedValue([])

            const userWatcher = (await prisma.userWatcher.findFirst({
                where: { userId: user.id },
            }))!
            watchersService.shouldNotifyUser = jest.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.id)

            expect(mockTransporter.sendMail).toBeCalledTimes(0)
        })

        it('should not send email to user if #shouldNotifyUser returns false', async () => {
            jest.spyOn(prisma.listing, 'findMany').mockResolvedValue(
                Array(configService.get('notification.watcher.minListings'))
            )

            const userWatcher = (await prisma.userWatcher.findFirst({
                where: { userId: user.id },
            }))!
            watchersService.shouldNotifyUser = jest.fn().mockResolvedValue(false)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.watcherId)

            expect(mockTransporter.sendMail).not.toBeCalled()
        })
    })

    describe('#notifyUsersInWatcher', () => {
        it('should try to notify all users in watcher', async () => {
            const watcher = await WatcherFactory.create()

            const notifyMock = jest
                .spyOn(watchersService, 'notifyUserOfWatcher')
                .mockResolvedValue(true)

            await watchersService.notifyUsersInWatcher(watcher.id)

            expect(notifyMock).toBeCalledTimes(await watchersService.subscriberCount(watcher.id))
        })
    })

    describe('#notifyAll', () => {
        beforeEach(async () => {
            // generate multiple watchers
            while ((await prisma.watcher.count()) < 12) {
                await WatcherFactory.create()
            }
        })

        it('should notify all users in all watchers', async () => {
            let userCount = 0
            // find total numbers of subscribers
            for (const { id } of await prisma.watcher.findMany()) {
                userCount += await watchersService.subscriberCount(id)
            }

            watchersService.notifyUserOfWatcher = jest.fn()
            await watchersService.notifyAll()

            expect(watchersService.notifyUserOfWatcher).toBeCalledTimes(userCount)
        })
    })
})
