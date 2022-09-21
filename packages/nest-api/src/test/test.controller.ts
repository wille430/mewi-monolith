import { Controller, Post } from '@nestjs/common'
import { randomPassword } from '@mewi/test-utils'
import { randomEmail } from '@mewi/test-utils'
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
