import { Injectable } from '@nestjs/common'
import { User, UserDocument } from 'users/user.schema'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | undefined> {
    const user = await this.userModel.findOne({ email })

    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user
      return result
    }

    return undefined
  }

  async login(user: User) {
    const payload = { email: user.email, sub: user._id }
    return {
      access_token: this.jwtService.sign(payload),
      refetch_token: this.jwtService.sign(payload, { expiresIn: '7d' }),
    }
  }
}
