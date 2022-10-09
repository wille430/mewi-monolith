import { NextApiRequest, NextApiResponse } from 'next'
import Cookies from 'cookies'
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from '@wille430/common'

function logoutRoute(req: NextApiRequest, res: NextApiResponse) {
    const cookies = new Cookies(req, res)
    cookies.set(ACCESS_TOKEN_COOKIE)
    cookies.set(REFRESH_TOKEN_COOKIE)

    res.redirect('/')
}

export default logoutRoute
