import type { NextApiRequest } from 'next'
import { createParamDecorator } from 'next-api-decorators'
import { getSession } from 'next-auth/react'
import type { UserPayload } from '../types/UserPayload'

export const GetUser = createParamDecorator<Promise<UserPayload | undefined>>(
    async (req: NextApiRequest) => {
        const session = await getSession({ req })
        return session?.user
    }
)
