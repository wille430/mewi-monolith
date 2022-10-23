import { AuthService } from '@/auth/auth.service'
import { LoginDto } from '@/auth/dto/login.dto'
import { UsersRepository } from '@/users/users.repository'
import { randomEmail, randomPassword } from '@mewi/test-utils'
import { Injectable } from '@nestjs/common'
import { AuthTokens } from '@wille430/common'

@Injectable()
export class TestService {
    constructor(private usersRepository: UsersRepository, private authService: AuthService) {}

    async createUser(): Promise<LoginDto & AuthTokens> {
        const email = randomEmail()
        const password = randomPassword()

        const accessTokens = await this.authService.signUp({
            email,
            password,
            passwordConfirm: password,
        })

        return {
            email,
            password,
            ...accessTokens,
        }
    }
}
