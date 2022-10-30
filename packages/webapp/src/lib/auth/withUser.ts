import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getSession } from '@/backend/lib/session/getSession'

export const addUserToRequest = async (context: GetServerSidePropsContext, handler) => {
    const { req, res } = context

    await getSession(req as any, res as any)

    return handler(context)
}

export const withUser = (handler: GetServerSideProps): GetServerSideProps => {
    return async (context: GetServerSidePropsContext) => addUserToRequest(context, handler)
}
