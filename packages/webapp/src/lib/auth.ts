// import { jwtVerify, SignJWT } from 'jose'
import { Role } from '@mewi/prisma/index-browser'
import { IncomingMessage, ServerResponse } from 'http'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { withSessionSsr } from './withSession'

export interface UserJwtPayload {
    jti: string
    iat: number
    role: Role
}

export const withAuth = (
    handler: (
        req: IncomingMessage & { cookies: NextApiRequestCookies },
        res: ServerResponse
    ) => any,
    allowedRoles?: Role[]
) => {
    return withSessionSsr(async ({ req, res }) => {
        const { roles } = req.session?.user ?? {}

        if (allowedRoles && (!roles || !allowedRoles.some((x) => roles.includes(x)))) {
            // redirect
            return {
                redirect: {
                    destination: '/loggain',
                },
            }
        }

        return handler(req, res)
    })
}
