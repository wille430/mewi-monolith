import { Controller, Request, Post, UseGuards, Body, Get, Req, Res } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import SignUpDto from '@/auth/dto/sign-up.dto'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { Request as ReqObj } from 'express'
import RefreshTokenDto from '@/auth/dto/refresh-token.dto'
import { GoogleAuthGuard } from '@/auth/google-auth.guard'
import { Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { User } from '@prisma/client'

@Controller('/apiv2/auth')
export class AuthController {
    constructor(private authService: AuthService, private readonly configService: ConfigService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ReqObj & { user: User }, @Res() res: Response) {
        const tokens = await this.authService.login(req.user)
        res.cookie('token', tokens.access_token, { expires: new Date() })
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto, @Res() res: Response) {
        const tokens = await this.authService.signUp(signUpDto)
        res.cookie('token', tokens.access_token, { expires: new Date() })
    }

    @Post('token')
    async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto)
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
