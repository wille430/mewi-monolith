import { MongooseModule, getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { User, UserDocument, UserSchema } from './user.schema'
import { UsersService } from './users.service'
import { Model } from 'mongoose'
import { factory } from 'fakingoose'
import { UpdateUserDto } from './dto/update-user.dto'
import { randomEmail, randomPassword } from '@wille430/common'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { VerifyEmailDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import { EmailService } from '../email/email.service'
import { EmailModule } from '../email/email.module'
import { ConfigModule } from '@nestjs/config'
import configuration from '../config/configuration'
import * as crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { LoginStrategy } from '@wille430/common'

describe('UsersService', () => {
    let usersService: UsersService
    let emailService: EmailService

    let mongod: MongoMemoryServer
    let userModel: Model<UserDocument>
    const userFactory = factory(UserSchema, {}).setGlobalObjectIdOptions({
        tostring: false,
    })

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
                EmailModule,
                ConfigModule.forRoot({ load: [configuration] }),
            ],
            providers: [UsersService],
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        emailService = module.get<EmailService>(EmailService)
        userModel = module.get<Model<UserDocument>>(getModelToken(User.name))
    })

    beforeEach(async () => {
        const mockUser = userFactory.generate({
            email: randomEmail(),
            loginStrategy: LoginStrategy.Local,
        })
        user = await userModel.create(mockUser)
        await user.save()
    })

    afterEach(() => {
        userModel.remove({})
    })

    it('should be defined', () => {
        expect(usersService).toBeDefined()
    })

    describe('#create', () => {
        it('should create new user and return it', async () => {
            const createUserDto: CreateUserDto = {
                email: randomEmail(),
                password: randomPassword(),
            }

            const newUser = await usersService.create(createUserDto)

            expect(newUser).toHaveProperty('email', createUserDto.email)
            expect(newUser).toHaveProperty('premium', false)
            expect(newUser).toHaveProperty('watchers', [])
        })
    })

    describe('#findAll', () => {
        it('should return an array of users', async () => {
            expect(await usersService.findAll()).toEqual(await userModel.find({}))
        })
    })

    describe('#findOne', () => {
        it('should return one user', async () => {
            expect(await usersService.findOne(user._id)).toBeInstanceOf(Object)
        })
    })

    describe('#update', () => {
        it('should return updated user', async () => {
            const updateUserDto: UpdateUserDto = { email: randomEmail() }
            const updatedUser = await usersService.update(user._id, updateUserDto)

            expect(updatedUser).toHaveProperty('email', updateUserDto.email)
        })
    })

    describe('#remove', () => {
        it('should remove user', async () => {
            expect(await usersService.findOne(user._id)).toBeTruthy()

            await usersService.remove(user._id)

            expect(await usersService.findOne(user._id)).toBeNull()
        })
    })

    describe('#changePassword', () => {
        it('should update password for user', async () => {
            const changePasswordDto: ChangePasswordAuth = {
                password: randomPassword(),
                passwordConfirm: '',
            }
            changePasswordDto.passwordConfirm = changePasswordDto.password

            const originalPassHash = user.password

            await usersService.changePassword(changePasswordDto, user._id)

            expect(
                (await userModel.findOne({ _id: user._id }, { password: 1 })).password
            ).not.toEqual(originalPassHash)
        })
    })

    describe('#changePasswordWithToken', () => {
        it('should update password for user', async () => {
            const token = crypto.randomBytes(32).toString('hex')

            const changePasswordDto: ChangePasswordWithToken = {
                token,
                email: user.email,
                password: randomPassword(),
                passwordConfirm: '',
            }
            changePasswordDto.passwordConfirm = changePasswordDto.password

            await userModel.findByIdAndUpdate(user._id, {
                $set: {
                    passwordReset: {
                        tokenHash: await bcrypt.hash(token, 10),
                        expiration: Date.now() + 15 * 60 * 60 * 1000,
                    },
                },
            })

            const originalPassHash = user.password

            await usersService.changePasswordWithToken(changePasswordDto)

            expect(
                (await userModel.findOne({ _id: user._id }, { password: 1 })).password
            ).not.toEqual(originalPassHash)
        })

        it('should throw with invalid token', async () => {
            const token = crypto.randomBytes(32).toString('hex')

            const changePasswordDto: ChangePasswordWithToken = {
                token,
                email: user.email,
                password: randomPassword(),
                passwordConfirm: '',
            }
            changePasswordDto.passwordConfirm = changePasswordDto.password

            await userModel.findByIdAndUpdate(user._id, {
                $set: {
                    passwordReset: {
                        tokenHash: await bcrypt.hash(token, 10),
                        expiration: Date.now() - 1000,
                    },
                },
            })

            try {
                await usersService.changePasswordWithToken(changePasswordDto)
                expect(true).toBe(false)
            } catch (e) {
                expect(e).toBeTruthy()
            }
        })
    })

    describe('#sendPasswordResetEmail', () => {
        it('should set passwordReset field and send email', async () => {
            const passwordResetDto: ChangePasswordNoAuth = { email: user.email }

            const mockTransporter = await emailService.transporter()
            mockTransporter.sendMail = vi.fn()
            emailService.transporter = vi.fn().mockResolvedValue(mockTransporter)

            await usersService.sendPasswordResetEmail(passwordResetDto)

            user = await userModel.findById(user._id, ['+passwordReset'])

            expect(user.passwordReset?.expiration).toBeGreaterThan(Date.now())
            expect(typeof user.passwordReset?.tokenHash).toBe('string')

            expect(mockTransporter.sendMail).toBeCalledTimes(1)
        })
    })

    describe('#verifyEmailUpdate', () => {
        it('should set updateEmail details and send email', async () => {
            const sendEmailUpdateDto: VerifyEmailDto = { newEmail: randomEmail() }

            const mockTransporter = await emailService.transporter()
            mockTransporter.sendMail = vi.fn()
            emailService.transporter = vi.fn().mockResolvedValue(mockTransporter)

            await usersService.verifyEmailUpdate(sendEmailUpdateDto, user._id)

            user = await userModel.findById(user._id, { emailUpdate: 1 })

            expect(user.emailUpdate.newEmail).toBe(sendEmailUpdateDto.newEmail)
            expect(typeof user.emailUpdate.tokenHash).toBe('string')
            expect(user.emailUpdate?.expiration).toBeGreaterThan(Date.now())

            expect(mockTransporter.sendMail).toBeCalledTimes(1)
        })
    })

    describe('#updateEmail', () => {
        it('should update email with valid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(32).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            await userModel.findByIdAndUpdate(user._id, {
                $set: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: Date.now() + 1000,
                    },
                },
            })

            const updateEmailDto: AuthorizedUpdateEmailDto = { token: token, oldEmail: user.email }

            await usersService.updateEmail(updateEmailDto)

            user = await userModel.findById(user._id, '+emailUpdate')

            expect(user.email).toBe(newEmail)
            expect(typeof user.emailUpdate).toBe('undefined')
        })

        it('should throw with invalid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(16).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            await userModel.findByIdAndUpdate(user._id, {
                $set: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: Date.now(),
                    },
                },
            })

            const updateEmailDto: AuthorizedUpdateEmailDto = {
                token: crypto.randomBytes(16).toString('hex'),
                oldEmail: user.email,
            }

            try {
                await usersService.updateEmail(updateEmailDto)
                expect(true).toBe(false)
            } catch (e) {
                expect(e.message).toBe('Invalid token')
            }
        })

        it('should throw with expired token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(16).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            await userModel.findByIdAndUpdate(user._id, {
                $set: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: Date.now() - 1000,
                    },
                },
            })

            const updateEmailDto: AuthorizedUpdateEmailDto = {
                token,
                oldEmail: user.email,
            }

            try {
                await usersService.updateEmail(updateEmailDto)
                expect(true).toBe(false)
            } catch (e) {
                expect(e.message).toBe('Invalid token')
            }
        })
    })
})
