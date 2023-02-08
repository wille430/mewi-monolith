import { compare, hash } from 'bcrypt'
import { BadRequestException, ConflictException } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import type SignUpDto from './dto/sign-up.dto'
import type { LoginDto } from './dto/login.dto'
import { UsersRepository } from '../users/users.repository'

@autoInjectable()
export class AuthService {
    constructor(@inject(UsersRepository) private readonly usersRepository: UsersRepository) {}

    async signUp(signUpDto: SignUpDto) {
        const { password, email } = signUpDto

        if (await this.usersRepository.findOne({ email })) {
            throw new ConflictException('User Already Exists')
        }

        const hashedPassword = await hash(password, 10)
        const newUser = await this.usersRepository.create({ email, password: hashedPassword })

        return newUser
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto

        const user = await this.usersRepository.findOne({ email })
        if (!user) {
            throw new BadRequestException('Invalid email or password')
        }

        const validPassword = user.password && (await compare(password, user.password))
        if (!validPassword) {
            throw new BadRequestException('Invalid email or password')
        }

        return user
    }
}
