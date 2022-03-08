/**
 * @module PasswordService
 * Password specific business logic
 */

import { UserService } from './index'
import bcrypt from 'bcryptjs'
import UserModel from 'models/UserModel'
import { APIError, AuthErrorCodes, MissingUserError } from '@mewi/types'
import jwt from 'jsonwebtoken'

class PasswordService {
    static async correctPassword(userId: string, password: string): Promise<boolean> {
        const user = await UserService.user(userId)
        const encryptedPassword = user.password

        const matches: boolean = await bcrypt.compare(password, encryptedPassword)

        return matches
    }

    static validate(password: string): boolean {
        const re = new RegExp(
            /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-?;,.{}|":<>[\]\\' ~_]).{8,}/gm
        )

        return re.test(password)
    }

    static async createResetToken(userId: string): Promise<string> {
        // get passwordResetToken from user
        const user = await UserModel.findById(userId)
        if (!user) throw MissingUserError

        const passwordResetSecret = user.passwordResetSecret

        // create jwt
        return jwt.sign({ userId }, passwordResetSecret, { expiresIn: '20m' })
    }

    static async updatePassword(
        userId: string,
        newPassword: string,
        passwordResetToken: string
    ): Promise<void> {
        const user = await UserModel.findById(userId)
        if (!user) throw MissingUserError

        // validate password
        if (!PasswordService.validate(newPassword)) {
            throw new APIError(422, AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH)
        }

        // validate reset token
        jwt.verify(passwordResetToken, user.passwordResetSecret, (err, payload) => {
            if (err) {
                switch (err.name) {
                    case 'TokenExpiredError':
                        throw new APIError(401, AuthErrorCodes.INVALID_JWT, 'Token is expired')
                    default:
                        throw new APIError(401, AuthErrorCodes.INVALID_JWT)
                }
            }
        })

        // set new password
        user.password = newPassword
        await user.save()
    }
}

export default PasswordService
