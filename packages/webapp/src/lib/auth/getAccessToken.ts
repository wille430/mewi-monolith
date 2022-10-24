import { ACCESS_TOKEN_COOKIE } from '@wille430/common'
import type { IncomingMessage } from 'http'

export const getAccessToken = (req: IncomingMessage): string | undefined => {
    return req.cookies[ACCESS_TOKEN_COOKIE]
}
