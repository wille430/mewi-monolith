import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { Request } from 'express'
import { ACCESS_TOKEN_COOKIE } from '@wille430/common'
import { jwtConstants } from './constants'

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
                (request: Request) => {
                    const token = request.cookies[ACCESS_TOKEN_COOKIE]
                    if (!token) {
                        return null
                    }
                    return token
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: jwtConstants.secret,
        })
    }

    private static extractJWT(req: Request): string | null {
        if (
            req.cookies &&
            ACCESS_TOKEN_COOKIE in req.cookies &&
            req.cookies[ACCESS_TOKEN_COOKIE].length > 0
        ) {
            return req.cookies[ACCESS_TOKEN_COOKIE]
        } else {
            return null
        }
    }

    //   TODO: check if revoked?
    async validate(payload: any) {
        return { userId: payload.sub, email: payload.email } as UserPayload
    }
}
