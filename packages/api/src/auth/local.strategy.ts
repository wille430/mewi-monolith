import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthService } from './auth.service'
import mewi from '@mewi/types'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super({
            usernameField: 'email',
        })
    }

    async validate(email: string, password: string): Promise<typeof user> {
        const user = await this.authService.validateUser(email, password)

        if (!user) {
            throw new UnauthorizedException(mewi.Types.Auth.Error.INVALID_CREDENTIALS)
        }
        return user
    }
}
