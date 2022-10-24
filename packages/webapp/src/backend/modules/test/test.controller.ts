import { Controller, Get, Res } from '@nestjs/common'
import type { Response } from 'express'
import type { TestService } from './test.service'
import { setJWTCookies } from '@/auth/utils/setJWTCookies'

@Controller('/test')
export class TestController {
    constructor(private testService: TestService) {}

    @Get('/user')
    async getUser(@Res({ passthrough: true }) res: Response) {
        const accessTokens = await this.testService.createUser()

        setJWTCookies(res, accessTokens)

        return accessTokens
    }
}
