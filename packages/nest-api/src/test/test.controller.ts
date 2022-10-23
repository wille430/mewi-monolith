import { setJWTCookies } from '@/auth/utils/setJWTCookies'
import { Controller, Get, Res } from '@nestjs/common'
import { TestService } from './test.service'
import { Response } from 'express'

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
