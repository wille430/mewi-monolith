import { ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { LoginStrategy, User } from '@mewi/prisma'
import { ConfigService } from '@nestjs/config'
import RefreshTokenDto from './dto/refresh-token.dto'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { PrismaService } from '@/prisma/prisma.service'
import { AuthTokens } from '@/common/types/authTokens'

interface UserPayload {
    email: string
    sub: string
}

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private prisma: PrismaService,
        private configService: ConfigService
    ) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.prisma.user.findFirst({
            where: {
                email,
            },
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

        if (await this.prisma.user.findFirst({ where: { email } })) {
            throw new ConflictException({
                statusCode: 409,
                message: ['Email is already taken'],
                error: 'User Already Exists',
            })
        }

        const hashedPassword = await hash(password, 10)
        const newUser = await this.prisma.user.create({
            data: { email, password: hashedPassword },
        })

        return this.createTokens(newUser)
    }

    async refreshToken({ refresh_token }: RefreshTokenDto) {
        const payload: UserPayload = this.jwtService.verify(refresh_token, {
            secret: this.configService.get('auth.refreshToken.secret'),
        })
        const user = await this.prisma.user.findFirst({
            where: { email: payload.email },
        })

        if (!user) {
            return null
        }

        return this.createTokens(user)
    }

    async googleLogin(req: any) {
        if (!req.user) {
            throw new NotFoundException('No user received from Google')
        }

        const existingUser = await this.prisma.user.findFirst({
            where: { email: req.user.email },
        })
        if (existingUser) {
            //    login
            return this.createTokens(existingUser)
        } else {
            // create user
            const newUser = await this.prisma.user.create({
                data: {
                    email: req.user.email,
                    loginStrategy: LoginStrategy.GOOGLE,
                },
            })

            return this.createTokens(newUser)
        }
    }
}
