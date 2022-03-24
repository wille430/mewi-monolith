import { ConflictException, Injectable } from '@nestjs/common'
import { User, UserDocument } from 'users/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'
import { SignUpDto } from 'auth/dto/sign-up.dto'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<User | undefined> {
    const user = await this.userModel.findOne({ email }).select('+password')

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject()
      return result
    }

    return undefined
  }

  createTokens(user: User) {
    const payload = { email: user.email, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
      refetch_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
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

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = new this.userModel({ email, password: hashedPassword })

    return this.createTokens(await newUser.save())
  }
}