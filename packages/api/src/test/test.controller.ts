import { Controller, Post } from '@nestjs/common'
import { TestService } from './test.service'
import { UsersService } from '@/users/users.service'
import { Utils } from '@mewi/common'
import { AuthService } from '@/auth/auth.service'

@Controller('test')
export class TestController {
    constructor(
        private readonly testService: TestService,
        private readonly usersService: UsersService,
        private readonly authService: AuthService
    ) {}

    @Post('user')
    async create() {
        const password = Utils.randomPassword()
        const user = await this.usersService.create({
            email: Utils.randomEmail(),
            password: password,
        })

        const accessTokens = this.authService.createTokens(user)

        return { ...user.toJSON(), password: password, ...accessTokens }
    }
}
