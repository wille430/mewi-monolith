import { Controller, Post } from '@nestjs/common'
import { randomEmail, randomPassword } from '@wille430/common'
import { AuthService } from '@/auth/auth.service'
import { createUserFactory } from 'prisma-factory/generated'

@Controller('/test')
export class TestController {
    constructor(private readonly authService: AuthService) {}

    @Post('user')
    async create() {
        const userFactory = createUserFactory()
        const password = randomPassword()

        const user = await userFactory.create({
            email: randomEmail(),
            password: password,
        })

        const accessTokens = this.authService.createTokens(user)

        return { ...user, password: password, ...accessTokens }
    }
}
