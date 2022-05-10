import { Controller, Post } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { createUserFactory } from '@mewi/prisma/factory'

@Controller('/test')
export class TestController {
    constructor(private readonly authService: AuthService) {}

    @Post('user')
    async create() {
        // TODO
        const userFactory = createUserFactory()
        const user = await userFactory.create({
            email: '123',
            password: '123',
        })
        const accessTokens = this.authService.createTokens(user)
        return { ...user, password: '123', ...accessTokens }
    }
}
