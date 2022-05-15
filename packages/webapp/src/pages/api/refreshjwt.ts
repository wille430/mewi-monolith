import { logoutSession } from '@/lib/session'
import { withSessionRoute } from '@/lib/withSession'
import { ACCESS_TOKEN_COOKIE, AuthTokens, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'

export default withSessionRoute(refreshJwtRoute)

async function refreshJwtRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Retreive refresh token from cookie
        const cookies = new Cookies(req, res)
        const refresh_token = cookies.get(REFRESH_TOKEN_COOKIE)

        // Send refresh request to API server
        const apiRes = await fetch(process.env.NEXT_PUBLIC_API_URL + 'auth/token', {
            method: 'post',
            credentials: 'include',
            body: JSON.stringify({
                refresh_token,
            }),
        })

        // Handle API error response
        if (!apiRes.ok) {
            // Log out user
            logoutSession(req)

            return res.status(apiRes.status).json(await apiRes.json())
        }

        const newJwt: AuthTokens = await apiRes.json()

        // Set jwt in cookies in response
        cookies.set(ACCESS_TOKEN_COOKIE, newJwt.access_token)
        cookies.set(REFRESH_TOKEN_COOKIE, newJwt.refresh_token)

        // Return ok response or error
        res.status(200).json({
            statusCode: 200,
            message: 'OK',
        })
    } catch (e) {
        console.log(e)

        // Log out user
        logoutSession(req)

        res.status(500).json({
            statusCode: 500,
            message: e,
        })
    }
}