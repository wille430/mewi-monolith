import type { Role } from '@wille430/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextFunction } from 'next-api-decorators'
import { createMiddlewareDecorator, UnauthorizedException } from 'next-api-decorators'
import { getSession } from '../lib/session/getSession'

export const Roles = (...allowedRoles: Role[]) =>
    createMiddlewareDecorator(
        async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
            const session = await getSession(req, res)
            const user = session.user

            if (!user) {
                throw new UnauthorizedException('Not logged in')
            }

            if (!user.roles?.some((role) => allowedRoles.includes(role))) {
                throw new UnauthorizedException()
            }

            next()
        }
    )()
