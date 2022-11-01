import { compare, hash } from 'bcrypt'
import { BadRequestException, ConflictException } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import type SignUpDto from './dto/sign-up.dto'
import type { LoginDto } from './dto/login.dto'
import { UsersRepository } from '../users/users.repository'
import type { User } from '../schemas/user.schema'

@autoInjectable()
export class AuthService {
    constructor(@inject(UsersRepository) private readonly usersRepository: UsersRepository) {}

    async validateUser(email: string, pass: string): Promise<User | null> {
        const user = await this.usersRepository.findOne({
            email,
        })

        if (user?.password && (await compare(pass, user.password))) {
            return user
        }

        return null
    }

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
