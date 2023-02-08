import type {NextApiRequest} from 'next'
import {createParamDecorator} from 'next-api-decorators'
import type {UserPayload} from '../modules/common/types/UserPayload'

export const GetUser = createParamDecorator<Promise<UserPayload | undefined>>(
    async (req: NextApiRequest) => {
        return req.session?.user
    }
)
