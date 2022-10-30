import { NextApiRequest, NextApiResponse } from 'next'
import { NextFunction, UnauthorizedException } from 'next-api-decorators'

export const adminApiKeyMiddleware = (
    req: NextApiRequest,
    res: NextApiResponse,
    next: NextFunction
) => {
    const words = req.headers.authorization?.split(' ') ?? []
    const token = words[1]

    if (token === process.env.ADMIN_API_KEY && process.env.ADMIN_API_KEY != null) {
        next()
    } else {
        throw new UnauthorizedException()
    }
}
