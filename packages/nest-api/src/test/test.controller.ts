import { Controller, Post } from '@nestjs/common'
import { randomEmail, randomPassword } from '@wille430/common'
import { AuthService } from '@/auth/auth.service'

@Controller('/test')
export class TestController {
    constructor(private readonly authService: AuthService) {}

    @Post('user')
    async create() {
        // TODO
        const email = randomEmail()
        const password = randomPassword()

        const accessTokens = await this.authService.signUp({
            email,
            password,
            passwordConfirm: password,
        })

        return { email, password, ...accessTokens }
    }
}
