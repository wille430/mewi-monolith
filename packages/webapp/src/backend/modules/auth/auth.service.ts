import { compare, hash } from 'bcrypt'
import { ConflictException } from 'next-api-decorators'
import type { User } from 'next-auth'
import { autoInjectable, inject } from 'tsyringe'
import type SignUpDto from './dto/sign-up.dto'
import { UsersRepository } from '../users/users.repository'

@autoInjectable()
export class AuthService {
    constructor(@inject(UsersRepository) private usersRepository: UsersRepository) {}

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
}
