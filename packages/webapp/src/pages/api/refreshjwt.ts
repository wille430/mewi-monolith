import { AuthTokens, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import Cookies from 'cookies'
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import { withSessionRoute } from '@/lib/withSession'
import { logoutSession } from '@/lib/session'
import { setJwtCookies } from '@/lib/cookies'

export default withSessionRoute(refreshJwtRoute)

async function refreshJwtRoute(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Retreive refresh token from cookie
        let refresh_token = req.cookies[REFRESH_TOKEN_COOKIE]
        if (!refresh_token && req.body) {
            refresh_token = req.body.refresh_token
        }

        if (!refresh_token) {
            return res.status(400).send('Missing refresh token')
        }

        // Send refresh request to API server
        const newJwt: AuthTokens = await axios
            .post(new URL('/auth/token', process.env.NEXT_PUBLIC_API_URL).toString(), {
                refresh_token,
            })
            .then((res) => res.data)
            .catch((e) => {
                throw e
            })

        // Set jwt in cookies in response
        const cookies = new Cookies(req, res)
        setJwtCookies(cookies, newJwt)

        // Return ok response or error
        res.status(200).json(newJwt)
    } catch (e) {
        // Log out user
        logoutSession(req)

        res.status(500).json({
            statusCode: 500,
            message: e,
        })
    }
}
