import * as jwt from 'jsonwebtoken'
import { AuthService } from 'services/UserServices'
import { APIError, AuthErrorCodes } from '@mewi/types'

export const signUp = async (req, res, next) => {
    const { email, password, repassword } = req.body as Record<string, string>
    try {
        const authTokens = await AuthService.signUp(email.trim(), password.trim(), repassword.trim())
        res.status(201).json(authTokens)
    } catch (e) {
        next(e)
    }
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    try {
        const authTokens = await AuthService.login(email, password)
        res.status(200).json(authTokens)
    } catch (e) {
        next(e)
    }
}

export const validateToken = async (req, res, next) => {
    const { token } = req.body
    if (!token) return res.sendStatus(400)

    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
            next(new APIError(401, AuthErrorCodes.INVALID_JWT))
            return
        }
        res.sendStatus(200)
    })
}

export const refreshToken = async (req, res, next) => {
    const { refreshToken } = req.body
    if (!refreshToken) return res.sendStatus(400)

    jwt.verify(refreshToken, process.env.TOKEN_KEY, async (err, user) => {
        if (err) {
            next(new APIError(401, AuthErrorCodes.INVALID_REFRESH_TOKEN))
            return
        }

        const authTokens = await AuthService.createNewAuthTokens(user.user_id, user.email)

        res.status(201).json(authTokens)
    })
}
