// import { jwtVerify, SignJWT } from 'jose'
import { Role } from '@mewi/prisma/index-browser'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { IncomingMessage, ServerResponse } from 'http'
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

        if (!roles) {
            return {
                redirect: {
                    destination: '/loggain',
                },
            }
        }

        if (allowedRoles && !allowedRoles.some((x) => roles.includes(x))) {
            // redirect
            return {
                redirect: {
                    destination: '/',
                },
            }
        }

        return handler(req, res)
    })
}
