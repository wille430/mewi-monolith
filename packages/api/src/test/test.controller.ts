import { Controller, Post } from '@nestjs/common'
import { TestService } from './test.service'
import { UsersService } from '@/users/users.service'
import { randomEmail, randomPassword } from '@mewi/util'

@Controller('test')
export class TestController {
    constructor(
        private readonly testService: TestService,
        private readonly usersService: UsersService
    ) {}

    @Post('user')
    create() {
        return this.usersService.create({ email: randomEmail(), password: randomPassword() })
    }
}
