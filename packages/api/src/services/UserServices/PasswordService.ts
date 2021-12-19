
/**
 * @module PasswordService
 * Password specific business logic
 */

import { UserService } from "./index"
import bcrypt from 'bcryptjs'
import { APIError, AuthErrorCodes } from 'types/errorCodes'

class PasswordService {

    static async correctPassword(userId: string, password: string): Promise<boolean> {
        const user = await UserService.user(userId)
        const encryptedPassword = user.password

        const matches: boolean = await bcrypt.compare(password, encryptedPassword)

        return matches
    }

    static validate(password: string): boolean {
        const re = new RegExp(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()+=-\?;,.\{}|\":<>\[\]\\\' ~_]).{8,}/gm)

        return re.test(password)
    }

}

export default PasswordService