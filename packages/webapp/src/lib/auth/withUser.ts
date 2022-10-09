import { getMe } from '@/api/users'
import axios from 'axios'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { getAccessToken } from './getAccessToken'

export const addUserToRequest = async (context: GetServerSidePropsContext, handler) => {
    const { req } = context
    const accessToken = getAccessToken(req)

    const user = await getMe(
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
        axios
    )

    req.user = user

    return handler(context)
}

export const withUser = (handler: GetServerSideProps): GetServerSideProps => {
    return async (context: GetServerSidePropsContext) => addUserToRequest(context, handler)
}
