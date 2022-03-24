import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common'
import { AuthService } from 'auth/auth.service'
import { SignUpDto } from 'auth/dto/sign-up.dto'
import { LocalAuthGuard } from 'auth/local-auth.guard'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user)
  }

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    return this.authService.signUp(signUpDto)
  }
}
