import type { TestService } from './test.service'

@Controller('/test')
export class TestController {
    constructor(private testService: TestService) {}

    @Get('/user')
    async getUser(@Res({ passthrough: true }) res: any) {
        const accessTokens = await this.testService.createUser()

        setJWTCookies(res, accessTokens)

        return accessTokens
    }
}
