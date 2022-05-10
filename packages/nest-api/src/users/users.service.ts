import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import bcrypt from 'bcryptjs'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import { VerifyEmailDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import * as crypto from 'crypto'
import { EmailService } from '@/email/email.service'
import Email from 'email-templates'
import { ConfigService } from '@nestjs/config'
import { EnvVars } from '@/config/configuration'
import forgottenPasswordEmail from '@/emails/forgottenPasswordEmail'
import { PrismaService } from '@/prisma/prisma.service'
import { LoginStrategy, User } from '@mewi/prisma'

@Injectable()
export class UsersService {
    constructor(
        @Inject(PrismaService) private prisma: PrismaService,
        @Inject(EmailService) private readonly emailService: EmailService,
        @Inject(ConfigService) private configService: ConfigService<EnvVars>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.email = createUserDto.email.toLowerCase()

        return this.prisma.user.create({ data: createUserDto })
    }

    async findAll() {
        return await this.prisma.user.findMany()
    }

    async findOne(id: string): Promise<User | null> {
        return await this.prisma.user.findFirst({ where: { id: id } })
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
        await this.prisma.user.update({
            where: { id },
            data: {
                ...updateUserDto,
            },
        })

        return await this.findOne(id)
    }

    async remove(id: string) {
        await this.prisma.user.delete({
            where: { id },
        })
    }

    async changePassword(
        { password, passwordConfirm }: ChangePasswordAuth,
        userId?: string
    ): Promise<void> {
        if (password === passwordConfirm) {
            const newPasswordHash = await bcrypt.hash(password, 10)

            await this.prisma.user.update({
                where: { id: userId },
                data: {
                    password: newPasswordHash,
                },
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
            const user = await this.prisma.user.findFirst({ where: { email } })
            if (!user) return

            if (
                user.passwordReset &&
                user.passwordReset.expiration > Date.now() &&
                (await bcrypt.compare(token, user.passwordReset.tokenHash))
            ) {
                await this.prisma.user.update({
                    where: { id: user.id },
                    data: {
                        password: await bcrypt.hash(password, 10),
                        passwordReset: null,
                    },
                })
            } else {
                throw Error('Invalid token')
            }
        }
    }

    async sendPasswordResetEmail({ email }: ChangePasswordNoAuth) {
        try {
            const user = await this.prisma.user.findFirst({ where: { email } })
            if (!user) return

            if (user.loginStrategy !== LoginStrategy.LOCAL) {
                console.log(
                    `User ${user.id} is using a third-party login strategy and can't reset password.`
                )
                return
            }

            const token = crypto.randomBytes(32).toString('hex')

            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    passwordReset: {
                        tokenHash: await bcrypt.hash(token, 10),
                        // expire in 15 minutes
                        expiration: Date.now() + 15 * 60 * 60 * 1000,
                    },
                },
            })

            const transporter = await this.emailService.transporter()

            const emailObj = new Email({
                message: {
                    from: this.emailService.googleAuth.email,
                    to: email,
                    subject: 'Lösenordsåterställning',
                    html: forgottenPasswordEmail({
                        link:
                            this.configService.get<string>('CLIENT_URL') +
                            `/nyttlosenord?email=${email}&token=${token}`,
                    }).html,
                },
                transport: transporter,
            })

            const emailInfo = await emailObj.send()

            await transporter.sendMail(emailInfo.originalMessage)
        } catch (e) {
            console.log(e)
        }
    }

    async updateEmail({ token, oldEmail }: AuthorizedUpdateEmailDto) {
        const user = await this.prisma.user.findFirst({ where: { email: oldEmail } })
        if (!user) return

        if (
            user.emailUpdate &&
            user.emailUpdate.expiration.getTime() > Date.now() &&
            (await bcrypt.compare(token, user.emailUpdate?.tokenHash))
        ) {
            await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    email: user.emailUpdate.newEmail,
                    emailUpdate: null,
                },
            })
        } else {
            throw new Error('Invalid token')
        }
    }

    async verifyEmailUpdate({ newEmail }: VerifyEmailDto, userId: string) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } })
        if (!user) return

        if (user.loginStrategy !== LoginStrategy.LOCAL) {
            console.log(
                `User ${user.id} is using a third-party login strategy and can't reset password.`
            )
            return
        }

        const token = crypto.randomBytes(32).toString('hex')

        await this.prisma.user.update({
            where: { id: userId },
            data: {
                emailUpdate: {
                    tokenHash: await bcrypt.hash(token, 10),
                    newEmail,
                    // expire in 15 minutes
                    expiration: new Date(Date.now() + 15 * 60 * 60 * 1000),
                },
            },
        })

        const transporter = await this.emailService.transporter()

        const email = new Email({
            message: {
                from: this.emailService.googleAuth.email,
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
