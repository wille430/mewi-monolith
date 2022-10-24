import { Body, Post, ValidationPipe } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { AuthService } from './auth.service'
import type SignUpDto from './dto/sign-up.dto'

@autoInjectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService) {}

    // @Post('login')
    // async login(
    //     @Request() req: ReqObj & { user: User },
    //     @Res({ passthrough: true }) res: Response
    // ) {
    //     const tokens = await this.authService.login(req.user)

    //     setJWTCookies(res, tokens)

    //     return tokens
    // }

    // @Post('logout')
    // async logout(@Res({ passthrough: true }) res: Response) {
    //     setJWTCookies(res, {})

    //     return true
    // }

    @Post('signup')
    async signUp(@Body(ValidationPipe) signUpDto: SignUpDto) {
        await this.authService.signUp(signUpDto)
        return true
    }
}
