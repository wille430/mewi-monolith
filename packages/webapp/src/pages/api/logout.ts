import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_EXPIRATION,
    REFRESH_TOKEN_COOKIE,
} from '@wille430/common'
import { withSessionRoute } from '@/lib/withSession'

export default withSessionRoute(logoutRoute)

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    req.session.destroy()

    const cookies = new Cookies(req, res)
    cookies.set(ACCESS_TOKEN_COOKIE)
    cookies.set(REFRESH_TOKEN_COOKIE)
    cookies.set(ACCESS_TOKEN_EXPIRATION)

    res.redirect('/')
}
