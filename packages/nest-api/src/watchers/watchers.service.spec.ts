import { Test, TestingModule } from '@nestjs/testing'
import { randomEmail } from '@wille430/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { Transporter } from 'nodemailer'
import { User } from '@mewi/prisma'
import { createListingFactory, createUserFactory, createWatcherFactory } from '@mewi/prisma/factory'
import { vi } from 'vitest'
import { faker } from '@faker-js/faker'
import { WatchersService } from './watchers.service'
import { EmailModule } from '../email/email.module'
import configuration from '../config/configuration'
import { EmailService } from '../email/email.service'
import { ListingsModule } from '../listings/listings.module'
import notificationConfig from '../config/notification.config'
import { PrismaService } from '../prisma/prisma.service'

describe('WatchersService', () => {
    let watchersService: WatchersService
    let emailService: EmailService
    let configService: ConfigService
    let prisma: PrismaService

    let mockTransporter: Transporter

    const watcherFactory = createWatcherFactory({ metadata: { keyword: faker.random.word() } })
    const userFactory = createUserFactory({
        email: randomEmail(),
    })
    const listingFactory = createListingFactory({})

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
    })

    beforeEach(async () => {
        const watcher = await watcherFactory.create()

        user = await userFactory.create({
            email: randomEmail(),
            watchers: {
                create: {
                    watcherId: watcher.id,
                    notifiedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 10000),
                },
            },
        })

        mockTransporter = await emailService.transporter()
        mockTransporter.sendMail = vi.fn()
        emailService.transporter = vi.fn().mockResolvedValue(mockTransporter)
    })

    afterEach(async () => {
        vi.clearAllMocks()
    })

    afterAll(async () => {
        await prisma.userWatcher.deleteMany()
        await prisma.user.deleteMany()
        await prisma.watcher.deleteMany()

        await prisma.$disconnect()
    })

    describe('#notifyUserOfWatcher', () => {
        it('should send email to user and update user watcher', async () => {
            vi.spyOn(watchersService, 'newListings').mockImplementation(
                () => Array(12).fill(listingFactory.build()) as any
            )

            let userWatcher = await prisma.userWatcher.findFirst({ where: { userId: user.id } })
            watchersService.shouldNotifyUser = vi.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.watcherId)

            expect(mockTransporter.sendMail).toBeCalledTimes(1)

            // Get updated data
            user = await prisma.user.findUnique({
                where: { id: user.id },
            })

            userWatcher = await prisma.userWatcher.findFirst({
                where: {
                    userId: user.id,
                },
            })

            expect(userWatcher).toHaveProperty('notifiedAt')
            expect(userWatcher.notifiedAt.getTime()).toBeGreaterThan(Date.now() - 10 * 1000)
        })

        it('should not send email to user if no new listings were found', async () => {
            vi.spyOn(prisma.listing, 'findMany').mockResolvedValue([])

            const userWatcher = await prisma.userWatcher.findFirst({ where: { userId: user.id } })
            watchersService.shouldNotifyUser = vi.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.id)

            expect(mockTransporter.sendMail).toBeCalledTimes(0)
        })

        it('should not send email to user if #shouldNotifyUser returns false', async () => {
            vi.spyOn(prisma.listing, 'findMany').mockResolvedValue(
                Array(configService.get('notification.watcher.minListings'))
            )

            const userWatcher = await prisma.userWatcher.findFirst({ where: { userId: user.id } })
            watchersService.shouldNotifyUser = vi.fn().mockResolvedValue(false)

            await watchersService.notifyUserOfWatcher(user.id, userWatcher.watcherId)

            expect(mockTransporter.sendMail).not.toBeCalled()
        })
    })

    describe('#notifyUsersInWatcher', () => {
        it('should try to notify all users in watcher', async () => {
            const watcher = await watcherFactory.create()

            const notifyMock = vi
                .spyOn(watchersService, 'notifyUserOfWatcher')
                .mockResolvedValue(true)

            await watchersService.notifyUsersInWatcher(watcher.id)

            expect(notifyMock).toBeCalledTimes(await watchersService.subscriberCount(watcher.id))
        })
    })

    describe('#notifyAll', () => {
        it('should notify all users in all watchers', async () => {
            let userCount = 0

            // generate multiple watchers
            while ((await prisma.watcher.count()) < 12) {
                await watcherFactory.create()
            }

            // find total numbers of subscribers
            for (const { id } of await prisma.watcher.findMany()) {
                userCount += await watchersService.subscriberCount(id)
            }

            watchersService.notifyUserOfWatcher = vi.fn()
            await watchersService.notifyAll()

            expect(watchersService.notifyUserOfWatcher).toBeCalledTimes(userCount)
        })
    })
})
