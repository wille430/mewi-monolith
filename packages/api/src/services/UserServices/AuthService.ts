import { PasswordService } from './index'
import UserModel from 'models/UserModel'
import { APIError, AuthErrorCodes, AuthTokens, JWT } from '@mewi/types'
import * as jwt from 'jsonwebtoken'
import UserEmailService from './UserEmailService'
import bcrypt from 'bcryptjs'

class AuthService {
    static async login(email: string, password: string): Promise<AuthTokens> {
        email = email.toLowerCase()
        const user = await UserModel.findOne({ email })

        if (!user) throw new APIError(404, AuthErrorCodes.INVALID_EMAIL)

        const userId = user._id
        const correctPassword = await PasswordService.correctPassword(userId, password)

        if (!correctPassword) throw new APIError(401, AuthErrorCodes.INVALID_PASSWORD)

        return await this.createNewAuthTokens(userId, email)
    }

    /**
     * Validating input and creating user
     * @param email The email of the new user
     * @param password The password of the new user
     * @param repassword Should be the same as password
     * @returns a JWT-token
     */
    static async signUp(email: string, password: string, repassword: string): Promise<AuthTokens> {
        if (password !== repassword) throw new APIError(422, AuthErrorCodes.PASSWORD_NOT_MATCHING)
        email = email.toLowerCase()

        const userExists = await UserModel.findOne({ email: email })
        if (userExists) throw new APIError(409, AuthErrorCodes.USER_ALREADY_EXISTS)

        const validEmail = UserEmailService.validate(email)
        const validPassword = PasswordService.validate(password)

        if (!validEmail) {
            throw new APIError(422, AuthErrorCodes.INVALID_EMAIL)
        } else if (!validPassword) {
            throw new APIError(422, AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH)
        }

        const encryptedPassword = await bcrypt.hash(password, 10)

        const newUser = await UserModel.create({
            email: email,
            password: encryptedPassword,
        })

        return await this.createNewAuthTokens(newUser._id, email)
    }

    static async createNewAuthTokens(userId: string, email: string): Promise<AuthTokens> {
        return {
            jwt: await AuthService.createJWT(userId, email),
            refreshToken: await AuthService.createRefreshToken(userId, email),
        }
    }

    static async signJWT(userId: string, email: string, options?: jwt.SignOptions): Promise<JWT> {
        const payload: jwt.JwtPayload = {
            user_id: userId,
            email: email,
        }

        const secretKey = process.env.TOKEN_KEY

        if (!options) {
            options = {
                expiresIn: '1h',
            }
        }

        const token = jwt.sign(payload, secretKey, options)

        return token
    }

    static async createRefreshToken(userId: string, email: string): Promise<JWT> {
        return await AuthService.signJWT(userId, email, {
            expiresIn: '14d',
        })
    }

    static async createJWT(userId: string, email: string) {
        return await AuthService.signJWT(userId, email, {
            expiresIn: '1h',
        })
    }
}

export default AuthService
