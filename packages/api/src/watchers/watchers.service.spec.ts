import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User, UserDocument, UserSchema } from '../users/user.schema'
import { Model } from 'mongoose'
import { factory } from 'fakingoose'
import { randomEmail } from '@wille430/common'
import { EmailModule } from '../email/email.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import configuration from '../config/configuration'
import { WatchersService } from './watchers.service'
import { Watcher, WatcherDocument, WatcherSchema } from './watcher.schema'
import _ from 'lodash'
import { EmailService } from '../email/email.service'
import { Transporter } from 'nodemailer'
import { ListingsModule } from '../listings/listings.module'
import { Listing, ListingDocument, ListingSchema } from '../listings/listing.schema'
import notificationConfig from '../config/notification.config'

describe('WatchersService', () => {
    let watchersService: WatchersService
    let emailService: EmailService
    let configService: ConfigService

    let mongod: MongoMemoryServer

    let userModel: Model<UserDocument>
    let watcherModel: Model<WatcherDocument>
    let listingModel: Model<ListingDocument>

    let mockTransporter: Transporter

    const watcherFactory = factory(WatcherSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })
    const userFactory = factory(UserSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })
    const listingFactory = factory(ListingSchema)

    let user: UserDocument

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create()

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                MongooseModule.forRootAsync({
                    useFactory: async () => {
                        const uri = mongod.getUri()
                        return {
                            uri: uri,
                        }
                    },
                }),
                MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
                MongooseModule.forFeature([{ name: Watcher.name, schema: WatcherSchema }]),
                EmailModule,
                ListingsModule,
                ConfigModule.forRoot({ load: [configuration, notificationConfig] }),
            ],
            providers: [WatchersService],
        }).compile()

        watchersService = module.get<WatchersService>(WatchersService)
        emailService = module.get<EmailService>(EmailService)
        configService = module.get<ConfigService>(ConfigService)

        userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
        watcherModel = module.get<Model<WatcherDocument>>(getModelToken(Watcher.name))
        listingModel = module.get<Model<ListingDocument>>(getModelToken(Listing.name))
    })

    beforeEach(async () => {
        const mockUser = userFactory.generate({
            email: randomEmail(),
            'watchers.notifiedAt': new Date(Date.now() - 7 * 24 * 60 * 60 * 10000),
        })
        user = await userModel.create(mockUser)
        await user.save()

        for (const watcherId of user.watchers) {
            const mockWatcher = watcherFactory.generate({
                _id: watcherId,
            })
            await (await watcherModel.create(mockWatcher)).save()
        }

        mockTransporter = await emailService.transporter()
        mockTransporter.sendMail = vi.fn()
        emailService.transporter = vi.fn().mockResolvedValue(mockTransporter)
    })

    afterEach(() => {
        userModel.remove({})
        watcherModel.remove({})
        vi.clearAllMocks()
    })

    describe('#notifyUserOfWatcher', () => {
        it('should send email to user and update user watcher', async () => {
            vi.spyOn(listingModel, 'find').mockResolvedValue(
                Array(configService.get('notification.watcher.minListings')).fill(listingFactory.generate())
            )

            const userWatcher = _.sample(user.watchers)
            watchersService.shouldNotifyUser = vi.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user._id, userWatcher._id.toString())

            expect(mockTransporter.sendMail).toBeCalledTimes(1)

            user = await userModel.findById(user._id)
            expect(user.watchers.id(userWatcher._id).notifiedAt).toBeTruthy()
            expect(
                new Date(user.watchers.id(userWatcher._id).notifiedAt).getTime()
            ).toBeGreaterThan(Date.now() - 10 * 1000)
        })

        it('should not send email to user if no new listings were found', async () => {
            vi.spyOn(listingModel, 'find').mockResolvedValue([])

            const userWatcher = _.sample(user.watchers)
            watchersService.shouldNotifyUser = vi.fn().mockResolvedValue(true)

            await watchersService.notifyUserOfWatcher(user._id, userWatcher._id.toString())

            expect(mockTransporter.sendMail).toBeCalledTimes(0)
        })

        it('should not send email to user if #shouldNotifyUser returns false', async () => {
            vi.spyOn(listingModel, 'find').mockResolvedValue(
                Array(configService.get('notification.watcher.minListings'))
            )

            const userWatcher = _.sample(user.watchers)

            vi.spyOn(watchersService, 'shouldNotifyUser').mockResolvedValue(false)

            await watchersService.notifyUserOfWatcher(user._id, userWatcher._id.toString())

            expect(mockTransporter.sendMail).not.toBeCalled()
        })
    })

    describe('#notifyUsersInWatcher', () => {
        it('should try to notify all users in watcher', async () => {
            const watcher = await watcherModel.create(watcherFactory.generate())
            await watcher.save()

            const notifyMock = vi
                .spyOn(watchersService, 'notifyUserOfWatcher')
                .mockResolvedValue(true)

            await watchersService.notifyUsersInWatcher(watcher._id.toString())

            expect(notifyMock).toBeCalledTimes(watcher.users.length)
        })
    })

    describe('#notifyAll', () => {
        it('should notify all users in all watchers', async () => {
            // generate multiple watchers
            while ((await watcherModel.countDocuments()) < 12) {
                await (await watcherModel.create(watcherFactory.generate())).save()
            }

            const userCount = await watcherModel
                .aggregate([
                    {
                        $unwind: '$users',
                    },
                    {
                        $group: {
                            _id: null,
                            userCount: {
                                $count: {},
                            },
                        },
                    },
                ])
                .then((x) => x[0].userCount)

            watchersService.notifyUserOfWatcher = vi.fn()
            await watchersService.notifyAll()

            expect(watchersService.notifyUserOfWatcher).toBeCalledTimes(userCount)
        })
    })
})
