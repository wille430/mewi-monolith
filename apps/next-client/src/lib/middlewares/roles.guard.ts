import type { Role } from '@/common/schemas'
import type { NextApiRequest, NextApiResponse } from 'next'
import {
    ForbiddenException,
    NextFunction,
    createMiddlewareDecorator,
    UnauthorizedException,
} from 'next-api-decorators'
import { getSession } from '../session/getSession'

export const Roles = (...allowedRoles: Role[]) =>
    createMiddlewareDecorator(rolesMiddleware(...allowedRoles))()

export const rolesMiddleware =
    (...allowedRoles: Role[]) =>
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const session = await getSession(req, res)
        let user = session.user

        if (!user && process.env.NODE_ENV !== 'production') {
            user = req.session?.user
        }
        req.session = session

        if (!user) {
            throw new UnauthorizedException('Not logged in')
        }

        if (!user.roles?.some((role) => allowedRoles.includes(role))) {
            throw new ForbiddenException()
        }

        next()
    }
