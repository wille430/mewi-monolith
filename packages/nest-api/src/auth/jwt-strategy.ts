import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { jwtConstants } from './constants'
import { Request } from 'express'

export type UserPayload = {
    userId: string
    email: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                JwtStrategy.extractJWT,
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    private static extractJWT(req: Request): string | null {
        if (req.cookies && 'access_token' in req.cookies && req.cookies.user_token.length > 0) {
            return req.cookies.token
        } else {
            return null
        }
    }

    //   TODO: check if revoked?
    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email } as UserPayload
    }
}
