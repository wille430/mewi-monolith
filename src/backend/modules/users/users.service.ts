import { LoginStrategy } from '@/common/schemas'
import { autoInjectable, inject } from 'tsyringe'
import bcrypt from 'bcrypt'
import { BadRequestException, NotFoundException } from 'next-api-decorators'
import crypto from 'crypto'
import type { CreateUserDto } from './dto/create-user.dto'
import type { UpdateUserDto } from './dto/update-user.dto'
import type { RequestEmailUpdateDto, AuthorizedUpdateEmailDto } from './dto/update-email.dto'
import type { FindAllUserDto } from './dto/find-all-user.dto'
import { UsersRepository } from './users.repository'
import type {
    ChangePasswordAuth,
    ChangePasswordNoAuth,
    ChangePasswordWithToken,
} from './dto/change-password.dto'
import type { User } from '../schemas/user.schema'
import { Listing } from '../schemas/listing.schema'

@autoInjectable()
export class UsersService {
    constructor(@inject(UsersRepository) private readonly usersRepository: UsersRepository) {}

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
        if (password !== passwordConfirm) {
            throw new BadRequestException('Password and password confirmation must match')
        }
        const user = await this.usersRepository.findOne({ email })
        if (!user) throw new NotFoundException()
        if (!user.passwordReset) throw new BadRequestException('User has no pending password reset')

        const isValidToken = token != null && token === user.passwordReset.tokenHash
        // class-validator validates password validity
        const isValidPassword = !(await bcrypt.compare(password, user?.password ?? ''))
        if (!isValidPassword) {
            throw new BadRequestException(
                'The provided password is already in use. Please provide an unique password.'
            )
        }

        if (user.passwordReset && user.passwordReset.expiration > Date.now() && isValidToken) {
            await this.usersRepository.findByIdAndUpdate(user.id, {
                password: await bcrypt.hash(password, 10),
                passwordReset: null,
            })
        } else {
            throw new BadRequestException('Invalid token')
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

            // TODO: uncomment
            // const transporter = await this.emailService.transporter()

            // const emailObj = new Email({
            //     message: {
            //         from: this.emailService.credentials.email,
            //         to: email,
            //         subject: 'Lösenordsåterställning',
            //         html: forgottenPasswordEmail({
            //             link: new URL(
            //                 `/nyttlosenord?email=${email}&token=${token}`,
            //                 this.configService.get<string>('CLIENT_URL')
            //             ).toString(),
            //         }).html,
            //     },
            //     transport: transporter,
            // })

            // const emailInfo = await emailObj.send()

            // await transporter.sendMail(emailInfo.originalMessage)

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
        if (!user) throw new NotFoundException(`No users with email ${oldEmail} was found`)

        const isValidToken = token != null && token === user.emailUpdate?.tokenHash

        if (
            user.emailUpdate &&
            user.emailUpdate.expiration.getTime() > Date.now() &&
            token &&
            isValidToken
        ) {
            await this.usersRepository.findByIdAndUpdate(user.id, {
                email: user.emailUpdate.newEmail,
                emailUpdate: null,
            })
        } else {
            throw new Error('Invalid token')
        }
    }

    async requestEmailUpdate({ newEmail }: RequestEmailUpdateDto, userId: string) {
        const user = await this.usersRepository.findById(userId)
        if (!user) throw new NotFoundException(`No user with id ${userId} was found`)

        if (user.loginStrategy !== LoginStrategy.LOCAL) {
            throw new BadRequestException(
                `Requesting an email update is only possible for users that have signed up using email and password`
            )
        }

        const token = crypto.randomBytes(32).toString('hex')

        await this.usersRepository.findByIdAndUpdate(user.id, {
            $set: {
                emailUpdate: {
                    tokenHash: await bcrypt.hash(token, 10),
                    newEmail,
                    // expire in 15 minutes
                    expiration: new Date(Date.now() + 15 * 60 * 60 * 1000),
                },
            },
        })

        if (process.env.NODE_ENV === 'test') {
            return
        }

        // TODO: uncomment
        // const transporter = await this.emailService.transporter()

        // const email = new Email({
        //     message: {
        //         from: this.emailService.credentials.email,
        //     },
        //     transport: transporter,
        // })

        // const emailInfo = await email.send({
        //     template: this.emailService.templates.verifyEmail,
        //     message: {
        //         to: user.email,
        //     },
        //     locals: {
        //         redirectUrl: this.configService.get<string>('API_URL') + '/users/email',
        //         token,
        //         oldEmail: user.email,
        //     },
        // })

        // await transporter.sendMail(emailInfo.originalMessage)
    }

    async getLikedListings(userId: string) {
        const user = await this.usersRepository.findById(userId)
        if (!user) throw new NotFoundException(`No user with id ${userId} was found`)

        await user.populate('likedListings')
        return user.likedListings as Listing[]
    }
}
