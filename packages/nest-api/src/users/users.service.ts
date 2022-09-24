import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common'
import bcrypt from 'bcryptjs'
import Email from 'email-templates'
import { ConfigService } from '@nestjs/config'
import * as crypto from 'crypto'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { VerifyEmailDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import { FindAllUserDto } from './dto/find-all-user.dto'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import { EmailService } from '@/email/email.service'
import { EnvVars } from '@/config/configuration'
import forgottenPasswordEmail from '@/emails/forgottenPasswordEmail'
import { User } from '@/schemas/user.schema'
import { LoginStrategy } from '@/schemas/enums/LoginStrategy'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
    constructor(
        @Inject(EmailService) private readonly emailService: EmailService,
        @Inject(ConfigService) private configService: ConfigService<EnvVars>,
        private readonly usersRepository: UsersRepository
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.email = createUserDto.email.toLowerCase()

        return this.usersRepository.create(createUserDto)
    }

    async findAll(findAllUserDto: FindAllUserDto = {}): Promise<User[] | null> {
        return await this.usersRepository.find(findAllUserDto)
    }

    async findOne(id: string): Promise<User | null> {
        return await this.usersRepository.findById(id)
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        await this.usersRepository.findByIdAndUpdate(id, updateUserDto)

        return await this.findOne(id)
    }

    async remove(id: string): Promise<User | null> {
        return await this.usersRepository.findByIdAndDelete(id)
    }

    async changePassword(
        { password, passwordConfirm }: ChangePasswordAuth,
        userId?: string
    ): Promise<void> {
        if (!userId) {
            throw new Error('userId was not provided')
        }

        if (password === passwordConfirm) {
            const newPasswordHash = await bcrypt.hash(password, 10)

            await this.usersRepository.findByIdAndUpdate(userId, {
                password: newPasswordHash,
            })
        } else {
            throw new Error('Passwords must match')
        }
    }

    async changePasswordWithToken({
        password,
        passwordConfirm,
        token,
        email,
    }: ChangePasswordWithToken) {
        if (password === passwordConfirm) {
            const user = await this.usersRepository.findOne({ email })
            if (!user) throw new NotFoundException()
            if (!user.passwordReset)
                throw new BadRequestException('User has no pending password reset')

            console.log(`Comparing ${token} and ${user.passwordReset?.tokenHash}`)

            if (
                user.passwordReset &&
                user.passwordReset.expiration > Date.now() &&
                (await bcrypt.compare(token, user.passwordReset.tokenHash))
            ) {
                await this.usersRepository.findByIdAndUpdate(user.id, {
                    password: await bcrypt.hash(password, 10),
                    passwordReset: null,
                })
            } else {
                throw Error('Invalid token')
            }
        }
    }

    async sendPasswordResetEmail({ email }: ChangePasswordNoAuth) {
        try {
            const user = await this.usersRepository.findOne({ email })
            if (!user) return

            if (user.loginStrategy !== LoginStrategy.LOCAL) {
                return
            }

            const token = crypto.randomBytes(32).toString('hex')

            await this.usersRepository.findByIdAndUpdate(user.id, {
                passwordReset: {
                    tokenHash: await bcrypt.hash(token, 10),
                    // expire in 15 minutes
                    expiration: Date.now() + 15 * 60 * 60 * 1000,
                },
            })

            const transporter = await this.emailService.transporter()

            const emailObj = new Email({
                message: {
                    from: this.emailService.credentials.email,
                    to: email,
                    subject: 'Lösenordsåterställning',
                    html: forgottenPasswordEmail({
                        link: new URL(
                            `/nyttlosenord?email=${email}&token=${token}`,
                            this.configService.get<string>('CLIENT_URL')
                        ).toString(),
                    }).html,
                },
                transport: transporter,
            })

            const emailInfo = await emailObj.send()

            await transporter.sendMail(emailInfo.originalMessage)

            // TODO: Create email record
            // await this.prisma.emailRecord.create({
            //     data: {
            //         to: user.email,
            //         from: this.emailService.credentials.email,
            //         userId: user.id,
            //         type: EmailType.PASSWORD_RESET,
            //     },
            // })
        } catch (e) {
            console.log(e)
        }
    }

    async updateEmail({ token, oldEmail }: AuthorizedUpdateEmailDto) {
        const user = await this.usersRepository.findOne({ email: oldEmail })
        if (!user) return

        if (
            user.emailUpdate &&
            user.emailUpdate.expiration.getTime() > Date.now() &&
            token &&
            (await bcrypt.compare(token, user.emailUpdate?.tokenHash ?? ''))
        ) {
            await this.usersRepository.findByIdAndUpdate(user.id, {
                email: user.emailUpdate.newEmail,
                emailUpdate: null,
            })
        } else {
            throw new Error('Invalid token')
        }
    }

    async verifyEmailUpdate({ newEmail }: VerifyEmailDto, userId: string) {
        const user = await this.usersRepository.findById(userId)
        if (!user) return

        if (user.loginStrategy !== LoginStrategy.LOCAL) {
            return
        }

        const token = crypto.randomBytes(32).toString('hex')

        await this.usersRepository.findByIdAndUpdate(userId, {
            emailUpdate: {
                tokenHash: await bcrypt.hash(token, 10),
                newEmail,
                // expire in 15 minutes
                expiration: new Date(Date.now() + 15 * 60 * 60 * 1000),
            },
        })

        const transporter = await this.emailService.transporter()

        const email = new Email({
            message: {
                from: this.emailService.credentials.email,
            },
            transport: transporter,
        })

        const emailInfo = await email.send({
            template: this.emailService.templates.verifyEmail,
            message: {
                to: user.email,
            },
            locals: {
                redirectUrl: this.configService.get<string>('API_URL') + '/users/email',
                token,
                oldEmail: user.email,
            },
        })

        await transporter.sendMail(emailInfo.originalMessage)
    }
}
