import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthService } from '@/auth/auth.service'
import { SignUpDto } from '@/auth/dto/sign-up.dto'
import { LocalAuthGuard } from '@/auth/local-auth.guard'
import { User } from '@/users/user.schema'
import { Request as ReqObj } from 'express'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: ReqObj & { user: User }) {
        return this.authService.login(req.user)
    }

    @Post('signup')
    async signUp(@Body() signUpDto: SignUpDto) {
        return this.authService.signUp(signUpDto)
    }
}
