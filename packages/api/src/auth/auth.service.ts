import {
    ConflictException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common'
import { User, UserDocument } from '@/users/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { compare, hash } from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { AuthTokens, LoginStrategy } from '@wille430/common'
import RefreshTokenDto from '@/auth/dto/refresh-token.dto'

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private jwtService: JwtService
    ) {}

    async validateUser(email: string, pass: string): Promise<User | undefined> {
        const user = await this.userModel.findOne({ email }).select('+password')

        if (user && (await compare(pass, user.password))) {
            return this.userModel.findOne({ email })
        }

        return undefined
    }

    createTokens(user: User): AuthTokens {
        const payload = { email: user.email, sub: user._id }
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: '7d',
                secret: process.env.REFRESH_TOKEN_SECRET,
            }),
        }
    }

    async login(user: User) {
        return this.createTokens(user)
    }

    async signUp(signUpDto: SignUpDto) {
        const { password, email } = signUpDto

        if (await this.userModel.findOne({ email })) {
            throw new ConflictException({
                statusCode: 409,
                message: ['Email is already taken'],
                error: 'User Already Exists',
            })
        }

        const hashedPassword = await hash(password, 10)
        const newUser = new this.userModel({ email, password: hashedPassword })

        return this.createTokens(await newUser.save())
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto) {
        const { refresh_token } = refreshTokenDto

        try {
            const payload = this.jwtService.verify(refresh_token, {
                secret: process.env.REFRESH_TOKEN_SECRET,
            })
            const user = await this.userModel.findOne({ email: payload.user })

            return this.createTokens(user)
        } catch (e) {
            throw new UnauthorizedException()
        }
    }

    async googleLogin(req: any) {
        if (!req.user) {
            throw new NotFoundException('No user received from Google')
        }

        const existingUser = await this.userModel.findOne({ email: req.user.email })
        if (existingUser) {
            //    login
            return this.createTokens(existingUser)
        } else {
            // create user
            const newUser = new this.userModel({
                email: req.user.email,
                loginStrategy: LoginStrategy.Google,
            })

            return this.createTokens(await newUser.save())
        }
    }
}
