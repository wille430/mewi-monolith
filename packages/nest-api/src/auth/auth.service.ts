import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import RefreshTokenDto from './dto/refresh-token.dto'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { AuthTokens } from '@/common/types/authTokens'
import { UsersRepository } from '@/users/users.repository'
import { User } from '@/schemas/user.schema'
import { LoginStrategy } from '@/schemas/enums/LoginStrategy'

interface UserPayload {
    email: string
    sub: string
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService,
        private usersRepository: UsersRepository
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            email,
        })

        if (user?.password && (await compare(pass, user.password))) {
            return user
        }

        return null
    }

    createTokens(user: User): AuthTokens {
        const payload: UserPayload = { email: user.email, sub: user.id }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                // @ts-ignore
                expiresIn: this.configService.get('auth.refreshToken.expiresIn'),
                secret: this.configService.get('auth.refreshToken.secret'),
            }),
        }
    }

    async login(user: User) {
        return this.createTokens(user)
    }

    async signUp(signUpDto: SignUpDto) {
        const { password, email } = signUpDto

        if (await this.usersRepository.findOne({ email })) {
            throw new ConflictException({
                statusCode: 409,
                message: ['Email is already taken'],
                error: 'User Already Exists',
            })
        }

        const hashedPassword = await hash(password, 10)
        const newUser = await this.usersRepository.create({ email, password: hashedPassword })

        return this.createTokens(newUser)
    }

    async refreshToken({ refresh_token }: RefreshTokenDto) {
        const payload: UserPayload = this.jwtService.verify(refresh_token, {
            secret: this.configService.get('auth.refreshToken.secret'),
        })
        const user = await this.usersRepository.findOne({ email: payload.email })
        if (!user) throw new NotFoundException()

        return this.createTokens(user)
    }

    async googleLogin(req: any) {
        if (!req.user) {
            throw new NotFoundException('No user received from Google')
        }

        const existingUser = await this.usersRepository.findOne({ email: req.user.email })
        if (existingUser) {
            //    login
            return this.createTokens(existingUser)
        } else {
            // create user
            const newUser = await this.usersRepository.create({
                email: req.user.email,
                loginStrategy: LoginStrategy.GOOGLE,
            })

            return this.createTokens(newUser)
        }
    }
}
