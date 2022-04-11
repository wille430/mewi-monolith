import { Inject, Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from '@/users/user.schema'
import { Model } from 'mongoose'
import bcrypt from 'bcryptjs'
import {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from '@/users/dto/change-password.dto'
import { ObjectId } from 'mongodb'
import { VerifyEmailDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import * as crypto from 'crypto'
import { EmailService } from '@/email/email.service'
import Email from 'email-templates'
import { ConfigService } from '@nestjs/config'
import { EnvVars } from '@/config/configuration'
import forgottenPasswordEmail from '@/emails/forgottenPasswordEmail'

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @Inject(EmailService) private readonly emailService: EmailService,
        @Inject(ConfigService) private configService: ConfigService<EnvVars>
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserDocument> {
        createUserDto.password = await bcrypt.hash(createUserDto.password, 10)
        createUserDto.email = createUserDto.email.toLowerCase()

        const newUser = new this.userModel(createUserDto)
        await newUser.save()

        return newUser
    }

    async findAll() {
        return await this.userModel.find({})
    }

    async findOne(id: string): Promise<UserDocument> {
        return await this.userModel.findById(id)
    }

    async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDocument> {
        await this.userModel.findOneAndUpdate({ _id: id }, updateUserDto)
        return await this.findOne(id)
    }

    async remove(id: string) {
        await this.userModel.deleteOne({ _id: new ObjectId(id) })
    }

    async changePassword(
        { password, passwordConfirm }: ChangePasswordAuth,
        userId?: string
    ): Promise<void> {
        if (password === passwordConfirm) {
            const newPasswordHash = await bcrypt.hash(password, 10)

            await this.userModel.updateOne(
                { _id: new ObjectId(userId) },
                { password: newPasswordHash }
            )

            return
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
            const user = await this.userModel.findOne({ email }, '+passwordReset')

            if (
                user.passwordReset &&
                (await bcrypt.compare(token, user.passwordReset.tokenHash)) &&
                user.passwordReset.expiration > Date.now()
            ) {
                await this.userModel.findByIdAndUpdate(user._id, {
                    $set: { password: await bcrypt.hash(password, 10) },
                    $unset: { passwordReset: '' },
                })
            } else {
                throw Error('Invalid token')
            }
        }
    }

    async sendPasswordResetEmail({ email }: ChangePasswordNoAuth) {
        try {
            const token = crypto.randomBytes(32).toString('hex')

            await this.userModel.updateOne(
                { email },
                {
                    $set: {
                        passwordReset: {
                            tokenHash: await bcrypt.hash(token, 10),
                            // expire in 15 minutes
                            expiration: Date.now() + 15 * 60 * 60 * 1000,
                        },
                    },
                }
            )

            const transporter = await this.emailService.transporter()

            const emailObj = new Email({
                message: {
                    from: this.emailService.googleAuth.email,
                    to: email,
                    subject: 'Lösenordsåterställning',
                    html: forgottenPasswordEmail(
                        {
                            link:  this.configService.get<string>('CLIENT_URL') +
                                                `/nyttlosenord?email=${email}&token=${token}`
                        }
                    ).html
                },
                transport: transporter,
                preview: true,
            })

            const emailInfo = await emailObj.send()

            await transporter.sendMail(emailInfo.originalMessage)
        } catch (e) {
            console.log(e)
        }
    }

    async updateEmail({ token, oldEmail }: AuthorizedUpdateEmailDto) {
        const user = await this.userModel.findOne({ email: oldEmail }, ['+emailUpdate'])

        if (
            user.emailUpdate &&
            user.emailUpdate.expiration > Date.now() &&
            (await bcrypt.compare(token, user.emailUpdate?.tokenHash))
        ) {
            await this.userModel.findByIdAndUpdate(user._id, {
                $set: {
                    email: user.emailUpdate.newEmail,
                },
                $unset: { emailUpdate: '' },
            })
        } else {
            throw new Error('Invalid token')
        }
    }

    async verifyEmailUpdate({ newEmail }: VerifyEmailDto, userId: string) {
        const token = crypto.randomBytes(32).toString('hex')

        await this.userModel.findByIdAndUpdate(userId, {
            $set: {
                emailUpdate: {
                    tokenHash: await bcrypt.hash(token, 10),
                    newEmail,
                    // expire in 15 minutes
                    expiration: Date.now() + 15 * 60 * 60 * 1000,
                },
            },
        })

        const transporter = await this.emailService.transporter()

        const email = new Email({
            message: {
                from: this.emailService.googleAuth.email,
            },
            transport: transporter,
            preview: true,
        })

        const user = await this.userModel.findById(userId)

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
