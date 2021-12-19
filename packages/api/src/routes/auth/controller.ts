import * as jwt from 'jsonwebtoken'
import { AuthService } from '../../../../mewi-backend/api/src/services/UserServices'
import { APIError, AuthErrorCodes } from '../../../../mewi-backend/api/src/types/errorCodes'

export const signUp = async (req, res, next) => {
    const { email, password, repassword } = req.body
    const token = await AuthService.signUp(email, password, repassword).catch(next)
    res.status(201).send(token)
}

export const login = async (req, res, next) => {
    const { email, password } = req.body
    const token = await AuthService.login(email, password).catch(next)
    res.status(200).send(token)
}

export const validateToken = async (req, res, next) => {
    const { token } = req.body
    if (!token) return res.sendStatus(400)

    jwt.verify(token, process.env.TOKEN_KEY, (err, user) => {
        if (err) {
            next(new APIError(401, (AuthErrorCodes.INVALID_JWT)))
        }
        res.sendStatus(200)
    })
}