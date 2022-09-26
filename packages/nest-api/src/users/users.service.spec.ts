import { Test, TestingModule } from '@nestjs/testing'
import { randomEmail, randomPassword } from '@mewi/test-utils'
import { ConfigModule } from '@nestjs/config'
import bcrypt from 'bcryptjs'
import { createUserFactory } from '@mewi/prisma/factory'
import * as crypto from 'crypto'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from './dto/change-password.dto'
import { CreateUserDto } from './dto/create-user.dto'
import { RequestEmailUpdateDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import { EmailService } from '../email/email.service'
import { EmailModule } from '../email/email.module'
import configuration from '../config/configuration'
import { PrismaService } from '../prisma/prisma.service'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserDocument, UserSchema } from '@/schemas/user.schema'
import { Model } from 'mongoose'

describe('UsersService', () => {
    let usersService: UsersService
    let emailService: EmailService

    let user: User
    let userModel: Model<UserDocument>
    const userFactory = createUserFactory({
        email: randomEmail(),
    })

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                EmailModule,
                ConfigModule.forRoot({ load: [configuration] }),
                MongooseModule.forFeature([
                    {
                        name: User.name,
                        schema: UserSchema,
                    },
                ]),
            ],
            providers: [UsersService, PrismaService],
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        emailService = module.get<EmailService>(EmailService)

        user = (await userFactory.create({
            emailUpdate: null,
            passwordReset: null,
        })) as any
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
        })
    })

    describe('#findAll', () => {
        it('should return an array of users', async () => {
            expect(await usersService.findAll()).toEqual(await userModel.find())
        })
    })

    describe('#findOne', () => {
        it('should return one user', async () => {
            expect(await usersService.findOne(user.id)).toBeInstanceOf(Object)
        })
    })

    describe('#update', () => {
        it('should return updated user', async () => {
            const updateUserDto: UpdateUserDto = { email: randomEmail() }
            const updatedUser = await usersService.update(user.id, updateUserDto)

            expect(updatedUser).toHaveProperty('email', updateUserDto.email)
        })
    })

    describe('#remove', () => {
        it('should remove user', async () => {
            expect(await usersService.findOne(user.id)).toBeTruthy()

            await usersService.remove(user.id)

            expect(await usersService.findOne(user.id)).toBeNull()
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

            await usersService.changePassword(changePasswordDto, user.id)

            expect((await userModel.findById(user.id))?.password).not.toEqual(originalPassHash)
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

            user = (await userModel.findByIdAndUpdate(user.id, {
                passwordReset: {
                    tokenHash: await bcrypt.hash(token, 10),
                    expiration: Date.now() + 15 * 60 * 60 * 1000,
                },
            }))!
            userModel.findById = jest.fn().mockResolvedValue(user)

            const originalPassHash = user.password

            await usersService.changePasswordWithToken(changePasswordDto)

            expect((await userModel.findById(user.id))?.password).not.toEqual(originalPassHash)
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

            await userModel.findByIdAndUpdate(user.id, {
                passwordReset: {
                    tokenHash: await bcrypt.hash(token, 10),
                    expiration: Date.now() - 1000,
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
            mockTransporter.sendMail = jest.fn()
            emailService.transporter = jest.fn().mockResolvedValue(mockTransporter)

            await usersService.sendPasswordResetEmail(passwordResetDto)

            user = (await userModel.findOne({ email: user.email }))!

            expect(user.passwordReset).toBeTruthy()
            expect(user.passwordReset?.expiration).toBeGreaterThan(Date.now())
            expect(typeof user.passwordReset?.tokenHash).toBe('string')

            expect(mockTransporter.sendMail).toBeCalledTimes(1)
        })
    })

    describe('#requestEmailUpdate', () => {
        it('should set updateEmail details and send email', async () => {
            const sendEmailUpdateDto: RequestEmailUpdateDto = { newEmail: randomEmail() }

            const mockTransporter = await emailService.transporter()
            mockTransporter.sendMail = jest.fn()
            emailService.transporter = jest.fn().mockResolvedValue(mockTransporter)

            await usersService.requestEmailUpdate(sendEmailUpdateDto, user.id)

            user = (await userModel.findById(user.id))!

            expect(user.emailUpdate?.newEmail).toBe(sendEmailUpdateDto.newEmail)
            expect(typeof user.emailUpdate?.tokenHash).toBe('string')
            expect(user.emailUpdate?.expiration?.getTime()).toBeGreaterThan(Date.now())

            expect(mockTransporter.sendMail).toBeCalledTimes(1)
        })
    })

    describe('#updateEmail', () => {
        it('should update email with valid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(32).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            user = (await userModel.findByIdAndUpdate(user.id, {
                emailUpdate: {
                    newEmail,
                    tokenHash,
                    expiration: new Date(Date.now() + 1000),
                },
            }))!

            const updateEmailDto: AuthorizedUpdateEmailDto = { token: token, oldEmail: user.email }

            userModel.findOne = jest.fn().mockResolvedValue(user)

            await usersService.updateEmail(updateEmailDto)

            const user2 = await userModel.findById(user.id)

            if (!user2) {
                throw new Error(`Could not find user with id ${user2}`)
            }
            user = user2

            expect(user.email).toBe(newEmail)
            expect(user.emailUpdate).not.toBeTruthy()
        })

        it('should throw with invalid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(16).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            user = (await userModel.findByIdAndUpdate(user.id, {
                emailUpdate: {
                    newEmail,
                    tokenHash,
                    expiration: new Date(),
                },
            }))!

            const updateEmailDto: AuthorizedUpdateEmailDto = {
                token: crypto.randomBytes(16).toString('hex'),
                oldEmail: user.email,
            }

            try {
                await usersService.updateEmail(updateEmailDto)
                expect(true).toBe(false)
            } catch (e: any) {
                expect(e.message).toBe('Invalid token')
            }
        })

        it('should throw with expired token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(16).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            await userModel.findByIdAndUpdate(user.id, {
                emailUpdate: {
                    newEmail,
                    tokenHash,
                    expiration: new Date(Date.now() - 1000),
                },
            })

            const updateEmailDto: AuthorizedUpdateEmailDto = {
                token,
                oldEmail: user.email,
            }

            try {
                await usersService.updateEmail(updateEmailDto)
                expect(true).toBe(false)
            } catch (e: any) {
                expect(e.message).toBe('Invalid token')
            }
        })
    })
})
