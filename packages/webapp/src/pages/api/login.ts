import { NextApiRequest, NextApiResponse } from 'next'
import { User } from '@mewi/prisma'
import Cookies from 'cookies'
import { ACCESS_TOKEN_COOKIE, AuthTokens, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import { withSessionRoute } from '@/lib/withSession'

export default withSessionRoute(loginRoute)

async function loginRoute(req: NextApiRequest, res: NextApiResponse) {
    // Get POST body data
    const { email, password } = JSON.parse(await req.body)

    const handleSuccess = async (apiRes: Response) => {
        const tokens: AuthTokens = await apiRes.json()

        // Pass cookies
        const cookies = new Cookies(req, res)
        cookies.set(ACCESS_TOKEN_COOKIE, tokens.access_token)
        cookies.set(REFRESH_TOKEN_COOKIE, tokens.refresh_token)

        const user: User = await fetch(process.env.NEXT_PUBLIC_API_URL + 'users/me', {
            method: 'get',
            credentials: 'include',
            headers: {
                Authorization: 'Bearer ' + tokens.access_token,
            },
        }).then((res) => res.json())

        req.session.user = {
            id: user.id,
            roles: user.roles,
        }

        await req.session.save()

        // res.redirect(308, '/minasidor')
        return res.status(200).json(tokens)
    }

    // get tokens from Nest API
    const apiRes = await fetch(process.env.NEXT_PUBLIC_API_URL + 'auth/login', {
        method: 'post',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })

    if (apiRes.ok) {
        return handleSuccess(apiRes)
    } else {
        return res.status(apiRes.status).json(await apiRes.json())
    }
}
