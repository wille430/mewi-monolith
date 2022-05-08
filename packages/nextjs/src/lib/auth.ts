// import { jwtVerify, SignJWT } from 'jose'
import { Role } from '@prisma/client/index-browser'
import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionSsr } from './withSession'

export interface UserJwtPayload {
    jti: string
    iat: number
    role: Role
}

export const withAuth = (
    handler: (req: NextApiRequest, res: NextApiResponse) => void,
    allowedRoles?: Role[]
) => {
    return withSessionSsr(async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
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
