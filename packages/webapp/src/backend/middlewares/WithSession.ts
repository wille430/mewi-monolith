import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextFunction } from 'next-api-decorators'
import { createMiddlewareDecorator, UnauthorizedException } from 'next-api-decorators'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '@/pages/api/auth/[...nextauth]'

export const WithSession = createMiddlewareDecorator(
    async (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
        const session = await unstable_getServerSession(req, res, authOptions)

        if (!session) {
            throw new UnauthorizedException('No session found')
        }

        const { expires, user } = session
        console.log({ user })

        if (!user || new Date(expires).getTime() < new Date().getTime()) {
            throw new UnauthorizedException('Expired session')
        }

        next()
    }
)
