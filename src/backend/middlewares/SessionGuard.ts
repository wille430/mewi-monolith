import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextFunction } from 'next-api-decorators'
import { createMiddlewareDecorator, UnauthorizedException } from 'next-api-decorators'
import { getSession } from '../lib/session/getSession'

export const SessionGuard = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const session = await getSession(req, res)
        let user = session.user

        if (!user && process.env.NODE_ENV !== 'production') {
            user = req.session?.user
        }

        if (!user) {
            throw new UnauthorizedException('Not logged in')
        }

        next()
    }
)

export const WithSession = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const session = await getSession(req, res)

        req.session = session

        next()
    }
)
