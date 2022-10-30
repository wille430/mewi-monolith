import type { Role } from '@wille430/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ForbiddenException, NextFunction } from 'next-api-decorators'
import { createMiddlewareDecorator, UnauthorizedException } from 'next-api-decorators'
import { getSession } from '../lib/session/getSession'

export const Roles = (...allowedRoles: Role[]) =>
    createMiddlewareDecorator(
        async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
            const session = await getSession(req, res)
            let user = session.user

            if (!user && process.env.NODE_ENV !== 'production') {
                user = req.session?.user
            }

            if (!user) {
                throw new UnauthorizedException('Not logged in')
            }

            if (!user.roles?.some((role) => allowedRoles.includes(role))) {
                throw new ForbiddenException()
            }

            next()
        }
    )()
