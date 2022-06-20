import { NextRequest, NextResponse } from 'next/server'
import {
    ACCESS_TOKEN_COOKIE,
    ACCESS_TOKEN_EXPIRATION,
    ACCESS_TOKEN_EXPIRES,
    REFRESH_TOKEN_COOKIE,
} from '@/lib/constants'

const handler = async (req: NextRequest) => {
    const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE]
    if (refreshToken && req.method === 'get') {
        // Check access token validity first
        if (
            req.cookies[ACCESS_TOKEN_COOKIE] &&
            new Date(req.cookies[ACCESS_TOKEN_EXPIRATION]).getTime() > Date.now()
        ) {
            return NextResponse.next()
        }

        try {
            // Get new tokens
            const tokens = await fetch(new URL('/api/refreshjwt', req.url).toString(), {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    refresh_token: refreshToken,
                }),
            }).then((o) => o.json())
            const res = NextResponse.next()

            // Set cookies to response
            res.cookie(ACCESS_TOKEN_COOKIE, tokens.access_token)
            res.cookie(REFRESH_TOKEN_COOKIE, tokens.refresh_token)
            res.cookie(ACCESS_TOKEN_EXPIRATION, ACCESS_TOKEN_EXPIRES())

            return res
        } catch (e) {
            return NextResponse.next()
        }
    }

    return NextResponse.next()
}

export default handler
