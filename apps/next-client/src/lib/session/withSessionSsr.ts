import { withIronSessionSsr } from 'iron-session/next'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { sessionOptions } from './sessionOptions'

// These types are compatible with InferGetStaticPropsType https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops
export const withSessionSsr = <P extends { [key: string]: unknown } = { [key: string]: unknown }>(
    handler: (
        context: GetServerSidePropsContext
    ) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) => withIronSessionSsr(handler, sessionOptions)
