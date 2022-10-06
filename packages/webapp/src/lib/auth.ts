import { Role } from '@wille430/common'
import { NextApiRequestCookies } from 'next/dist/server/api-utils'
import { IncomingMessage, ServerResponse } from 'http'
import { withSessionSsr } from './withSession'
import { ON_UNAUTHENTICATED_GOTO } from '@/constants/paths'

export interface IUserJwtPayload {
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
                    destination: ON_UNAUTHENTICATED_GOTO,
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
