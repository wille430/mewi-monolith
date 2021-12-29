import { APIError, AuthErrorCodes } from '@mewi/types'
import * as jwt from 'jsonwebtoken'

export default class Authentication {
    static basicAuthentication(req, res, next) {
        const authHeader = req.headers.authorization

        if (!(process.env.API_ADMIN_USERNAME && process.env.API_ADMIN_PASSWORD)) return next()

        // Check if auth was provided
        if (authHeader) {
            // Decrypt username and password
            const token = authHeader.split(' ')[1]
            const decryptedToken = Buffer.from(token, 'base64').toString('ascii')
            const [username, password] = decryptedToken.split(':')

            console.log({ decryptedToken, username, password })

            if (
                username === process.env.API_ADMIN_USERNAME &&
                password === process.env.API_ADMIN_PASSWORD
            ) {
                return next()
            } else {
                res.sendStatus(401)
            }
        } else {
            res.sendStatus(401)
        }
    }

    static authenticateJWT(req, res, next) {
        const authHeader = req.headers.authorization

        // Check if JWT was provided
        if (authHeader) {
            const token = authHeader.split(' ')[1]
            // Check if token is valid
            jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
                if (err) {
                    switch (err.name) {
                        case 'TokenExpiredError':
                            console.log('EXPIRED TOKEN!!!')
                            throw new APIError(401, AuthErrorCodes.INVALID_JWT)
                        default:
                            return res.sendStatus(403)
                    }
                }
                req.user = user
                next()
            })
        } else {
            res.sendStatus(401)
        }
    }
}
