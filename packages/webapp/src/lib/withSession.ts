import { IronSessionOptions } from 'iron-session'
import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from 'next'
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

export const withSessionSsr = <P extends { [key: string]: unknown }>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => withIronSessionSsr(handler, sessionOptions)
