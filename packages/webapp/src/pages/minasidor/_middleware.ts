import { ACCESS_TOKEN_COOKIE, AuthTokens, REFRESH_TOKEN_COOKIE } from '@wille430/common'
import { NextRequest, NextResponse } from 'next/server'
import { USER_TOKEN } from '@/lib/constants'

const handler = async (req: NextRequest) => {
    if (
        !(
            Object.keys(req.cookies).includes(ACCESS_TOKEN_COOKIE) &&
            Object.keys(req.cookies).includes(USER_TOKEN)
        )
    ) {
        console.log('Not logged in')

        if (req.cookies[REFRESH_TOKEN_COOKIE]) {
            console.log('Refreshing token')
            return await fetch(new URL('/api/refreshjwt', req.url).toString(), {
                credentials: 'include',
                method: 'post',
                body: JSON.stringify({ refresh_token: req.cookies[REFRESH_TOKEN_COOKIE] }),
            })
                .then(async (r) => {
                    const tokens: AuthTokens = await r.json()

                    const res = NextResponse.next()

                    res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token)
                    res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token)

                    return res
                })
                .catch((err) => {
                    console.log(err)
                    return NextResponse.redirect(new URL('/loggain', req.url))
                })
        }

        return NextResponse.redirect(new URL('/loggain', req.url))
    }

    return NextResponse.next()
}

export default handler
