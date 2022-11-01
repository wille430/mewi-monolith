import { randomEmail, randomPassword } from '@mewi/test-utils'
import { Injectable } from '@nestjs/common'
import type { AuthTokens } from '@/common/schemas'
import type { AuthService } from '@/auth/auth.service'
import type { LoginDto } from '@/auth/dto/login.dto'
import type { UsersRepository } from '@/users/users.repository'

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
