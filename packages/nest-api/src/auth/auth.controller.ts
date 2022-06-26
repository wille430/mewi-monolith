import {
    Controller,
    Request,
    Post,
    UseGuards,
    Body,
    Get,
    Req,
    Res,
    HttpException,
    HttpStatus,
} from '@nestjs/common'
import { Request as ReqObj } from 'express'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { User } from '@mewi/prisma'
import { REFRESH_TOKEN_COOKIE } from '@wille430/common'
import { setJWTCookies } from './utils/setJWTCookies'
import { AuthService } from '@/auth/auth.service'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import RefreshTokenDto from '@/auth/dto/refresh-token.dto'
import { GoogleAuthGuard } from '@/auth/google-auth.guard'
import { Public } from '@/common/decorators/public.decorator'

@Controller('/auth')
export class AuthController {
    constructor(private authService: AuthService, private readonly configService: ConfigService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(
        @Request() req: ReqObj & { user: User },
        @Res({ passthrough: true }) res: Response
    ) {
        const tokens = await this.authService.login(req.user)

        setJWTCookies(res, tokens)

        return tokens
    }

    @Post('logout')
    async logout(@Res({ passthrough: true }) res: Response) {
        setJWTCookies(res, {})

        return true
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto, @Res({ passthrough: true }) res: Response) {
        const tokens = await this.authService.signUp(signUpDto)

        setJWTCookies(res, tokens)

        return tokens
    }

    @Post('token')
    @Public()
    async refreshToken(
        @Body() refreshTokenDto: RefreshTokenDto,
        @Req() req: ReqObj,
        @Res({ passthrough: true }) res: Response
    ) {
        // Extract refresh token from req body or cookie header
        const refreshToken = refreshTokenDto.refresh_token ?? req.cookies[REFRESH_TOKEN_COOKIE]

        if (!refreshToken) {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED)
        }

        const tokens = await this.authService.refreshToken({ refresh_token: refreshToken })

        setJWTCookies(res, tokens)

        return tokens
    }

    @Get('google/redirect')
    @UseGuards(GoogleAuthGuard)
    async googleCallback(@Req() req, @Res() res: Response) {
        const authTokens = await this.authService.googleLogin(req)

        const redirectUrl =
            this.configService.get<string>('CLIENT_URL') +
            `/?access_token=${authTokens.access_token}&refresh_token=${authTokens.refresh_token}`

        res.redirect(redirectUrl)
    }
}
