// import { jwtVerify, SignJWT } from 'jose'
import { Role } from '@prisma/client/index-browser'
import { NextApiRequest, NextApiResponse } from 'next'
import { withSessionSsr } from './withSession'

export interface UserJwtPayload {
    jti: string
    iat: number
    role: Role
}

/**
 * Access levels for each role. The lower the better.
 */
export const ROLE_PERMISSION: Record<Role, number> = {
    ADMIN: 0,
    USER: 1,
    GUEST: 2,
}

// /**
//  * Verifies the user's JWT token and returns the payload if
//  * it's valid or a response if it's not.
//  */
// export const verifyAuth = async (request: NextRequest, minRole?: Role) => {
//     const token = request.cookies[USER_TOKEN]

//     if (!token) {
//         return jsonResponse(401, { error: { message: 'Missing user token.' } })
//     }

//     try {
//         const verified = await jwtVerify(token, new TextEncoder().encode(JWT_SECRET_KEY))
//         const payload = verified.payload as unknown as UserJwtPayload

//         if (ROLE_PERMISSION[payload.role] > ROLE_PERMISSION[minRole]) {
//             return jsonResponse(401, { message: "You don't have access to this resource." })
//         }

//         return payload
//     } catch (err) {
//         return jsonResponse(401, { error: { message: 'Your token has expired.' } })
//     }
// }

// /**
//  * Adds the user token cookie to a response.
//  */
// export const setUserCookie = async (request: NextRequest, response: NextResponse) => {
//     const cookie = request.cookies[USER_TOKEN]

//     if (!cookie) {
//         const token = await new SignJWT({
//             role: Role.GUEST,
//         })
//             .setProtectedHeader({ alg: 'HS256' })
//             .setJti(nanoid())
//             .setIssuedAt()
//             .setExpirationTime('2h')
//             .sign(new TextEncoder().encode(JWT_SECRET_KEY))

//         response.cookie(USER_TOKEN, token, { httpOnly: true })
//     }

//     return response
// }

export const withAuth = (
    handler: (req: NextApiRequest, res: NextApiResponse) => void,
    allowedRoles?: Role[]
) => {
    return withSessionSsr(async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
        const { role } = req.session?.user ?? {}

        if ((allowedRoles && !allowedRoles.includes(role)) || !role) {
            // redirect
            res.setHeader('location', '/login')
            res.statusCode = 302
            res.end()
        }

        return handler(req, res)
    })
}
