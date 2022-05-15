import { Controller, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { randomEmail, randomPassword } from '@wille430/common'

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
