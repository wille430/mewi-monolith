/**
 * @module PasswordService
 * Password specific business logic
 */

import { UserService } from './index'
import bcrypt from 'bcryptjs'
import UserModel from 'models/UserModel'
import { APIError, AuthErrorCodes, MissingUserError } from '@mewi/common'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

class PasswordService {
    static passwordPattern =
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-?;,.{}|":<>[\]\\' ~_]).{8,}/gm

    static async correctPassword(userId: string, password: string): Promise<boolean> {
        const user = await UserService.userById(userId)
        const encryptedPassword = user.password

        const matches: boolean = await bcrypt.compare(password, encryptedPassword)

        return matches
    }

    static validate(password: string): boolean {
        const re = new RegExp(this.passwordPattern)

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
        passwordConfirm: string,
        passwordResetToken: string
    ): Promise<void> {
        const user = await UserModel.findById(userId)
        if (!user) throw MissingUserError

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

        // validate password
        if (!PasswordService.validate(newPassword) || passwordConfirm !== newPassword) {
            throw new APIError(422, AuthErrorCodes.PASSWORD_NOT_STRONG_ENOUGH)
        }

        // set new password
        user.password = await PasswordService.hash(newPassword)

        // new secret
        user.passwordResetSecret = uuidv4()

        await user.save()
    }

    static hash(password: string) {
        return bcrypt.hash(password, 10)
    }
}

export default PasswordService
