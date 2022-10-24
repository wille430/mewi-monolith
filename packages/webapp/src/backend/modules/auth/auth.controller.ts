import type { NextApiRequest } from 'next'
import { Body, Post, Req, ValidationPipe } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { AuthService } from './auth.service'
import type { LoginDto } from './dto/login.dto'
import type SignUpDto from './dto/sign-up.dto'
import { WithSession } from '@/backend/middlewares/SessionGuard'

@autoInjectable()
export class AuthController {
    constructor(@inject(AuthService) private authService: AuthService) {}

    @Post('/signup')
    @WithSession()
    async signUp(@Body(ValidationPipe) signUpDto: SignUpDto, @Req() req: NextApiRequest) {
        const user = await this.authService.signUp(signUpDto)

        req.session.user = {
            userId: user.id,
            email: user.email,
            roles: user.roles,
        }
        await req.session.save()

        return true
    }

    @Post('/login')
    @WithSession()
    async login(@Body(ValidationPipe) loginDto: LoginDto, @Req() req: NextApiRequest) {
        const user = await this.authService.login(loginDto)

        req.session.user = {
            userId: user.id,
            email: user.email,
            roles: user.roles,
        }
        await req.session.save()

        return true
    }

    @Post('/logout')
    @WithSession()
    async logout(@Req() req: NextApiRequest) {
        req.session.destroy()
        return true
    }
}
