import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { randomEmail, randomPassword } from '@mewi/prisma'
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
import { PrismaService } from '../prisma/prisma.service'
import { User } from '@mewi/prisma'
import { createUserFactory } from 'prisma-factory/generated'
import { vi } from 'vitest'

describe('UsersService', () => {
    let usersService: UsersService
    let emailService: EmailService

    let prisma: PrismaService
    let user: User
    const userFactory = createUserFactory({
        email: randomEmail(),
    })

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [EmailModule, ConfigModule.forRoot({ load: [configuration] })],
            providers: [UsersService, PrismaService],
        }).compile()

        usersService = module.get<UsersService>(UsersService)
        emailService = module.get<EmailService>(EmailService)
        prisma = module.get<PrismaService>(PrismaService)
    })

    beforeEach(async () => {
        user = await userFactory.create({
            emailUpdate: null,
            passwordReset: null,
        })
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
            expect(await usersService.findAll()).toEqual(await prisma.user.findMany())
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

            expect((await prisma.user.findUnique({ where: { id: user.id } })).password).not.toEqual(
                originalPassHash
            )
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

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordReset: {
                        tokenHash: await bcrypt.hash(token, 10),
                        expiration: Date.now() + 15 * 60 * 60 * 1000,
                    },
                },
            })

            const originalPassHash = user.password

            await usersService.changePasswordWithToken(changePasswordDto)

            expect((await prisma.user.findUnique({ where: { id: user.id } })).password).not.toEqual(
                originalPassHash
            )
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

            await prisma.user.update({
                where: { id: user.id },
                data: {
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

            user = await prisma.user.findFirst({ where: { email: user.email } })

            expect(user.passwordReset).toBeTruthy()
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

            await usersService.verifyEmailUpdate(sendEmailUpdateDto, user.id)

            user = await prisma.user.findUnique({ where: { id: user.id } })

            expect(user.emailUpdate.newEmail).toBe(sendEmailUpdateDto.newEmail)
            expect(typeof user.emailUpdate.tokenHash).toBe('string')
            expect(user.emailUpdate?.expiration?.getTime()).toBeGreaterThan(Date.now())

            expect(mockTransporter.sendMail).toBeCalledTimes(1)
        })
    })

    describe('#updateEmail', () => {
        it('should update email with valid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(32).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: new Date(Date.now() + 1000),
                    },
                },
            })

            const updateEmailDto: AuthorizedUpdateEmailDto = { token: token, oldEmail: user.email }

            await usersService.updateEmail(updateEmailDto)

            user = await prisma.user.findUnique({
                where: { id: user.id },
            })

            expect(user.email).toBe(newEmail)
            expect(user.emailUpdate).not.toBeTruthy()
        })

        it('should throw with invalid token', async () => {
            const newEmail = randomEmail()
            const token = crypto.randomBytes(16).toString('hex')
            const tokenHash = await bcrypt.hash(token, 10)

            user = await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: new Date(),
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

            await prisma.user.update({
                where: { id: user.id },
                data: {
                    emailUpdate: {
                        newEmail,
                        tokenHash,
                        expiration: new Date(Date.now() - 1000),
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
