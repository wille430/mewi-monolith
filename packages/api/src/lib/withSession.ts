import { Parameters } from '@storybook/react'
import { IronSessionOptions } from 'iron-session'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { NextApiHandler } from 'next'
import * as crypto from 'crypto'

const sessionOptions: IronSessionOptions = {
    cookieName: 'user-session',
    password: process.env.SESSION_PASSWORD ?? crypto.randomBytes(32).toString('hex'),
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
}

export const withSessionRoute = (handler: NextApiHandler<any>) => {
    return withIronSessionApiRoute(handler, sessionOptions)
}

export const withSessionSsr = (handler: Parameters<typeof withIronSessionSsr>[0]) => {
    return withIronSessionSsr(handler, sessionOptions)
}
