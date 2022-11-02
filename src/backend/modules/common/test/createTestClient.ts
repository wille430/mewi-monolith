import { NextApiHandler } from 'next'
import { apiResolver } from 'next/dist/server/api-utils/node'
import { isFunction } from 'lodash'
import { createHandler } from 'next-api-decorators'
import { RequestListener } from 'http'
import { createServer } from 'http'
import { UserPayload } from '../types/UserPayload'
import { withSessionRoute } from '@/backend/lib/session/withSessionRoute'

export const createTestClient = (
    handler: NextApiHandler | (new (...args) => any),
    userPayload: UserPayload | undefined = undefined
) => {
    let handler2: NextApiHandler = isFunction(handler) ? handler : createHandler(handler)

    if (userPayload) {
        handler2 = withSessionRoute(async (req, res) => {
            req.session.user = userPayload
            await req.session.save()

            if (isFunction(handler)) {
                return handler(req, res)
            } else {
                return handler
            }
        })
    }

    const requestHandle: RequestListener = (request, response) =>
        apiResolver(
            request,
            response,
            undefined,
            handler2,
            {
                previewModeId: '',
                previewModeEncryptionKey: '',
                previewModeSigningKey: '',
            },
            false
        )

    const server = createServer(requestHandle)
    return server
}
