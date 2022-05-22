import { registerAs } from '@nestjs/config'
import crypto from 'crypto'

type AuthConfig = {
    accessToken: {
        secret: string
        expiresIn: string
    }
    refreshToken: {
        secret: string
        expiresIn: string
    }
}

export default registerAs(
    'auth',
    (): AuthConfig => ({
        accessToken: {
            secret: process.env.TOKEN_KEY ?? crypto.randomBytes(32).toString('hex'),
            expiresIn: '15m',
        },
        refreshToken: {
            secret: process.env.REFRESH_TOKEN_SECRET ?? crypto.randomBytes(32).toString('hex'),
            expiresIn: '7d',
        },
    })
)
