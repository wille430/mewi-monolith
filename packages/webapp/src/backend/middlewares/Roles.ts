import type { Role } from '@wille430/common'
import type { NextApiRequest, NextApiResponse } from 'next'
import type { NextFunction } from 'next-api-decorators'
import { createMiddlewareDecorator, UnauthorizedException } from 'next-api-decorators'
import { getSession } from 'next-auth/react'

export const Roles = (...allowedRoles: Role[]) =>
    createMiddlewareDecorator(
        async (req: NextApiRequest, _res: NextApiResponse, next: NextFunction) => {
            const session = await getSession({ req: req })

            if (!session) {
                throw new UnauthorizedException('No session')
            }

            const { expires, user } = session

            if (!user || new Date(expires).getTime() < new Date().getTime()) {
                throw new UnauthorizedException('Expired session')
            }

            if (!user.roles?.some(allowedRoles.includes)) {
                throw new UnauthorizedException()
            }

            next()
        }
    )()
