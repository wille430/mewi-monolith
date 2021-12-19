import { PasswordService } from "./index";
import UserModel from "models/UserModel";
import { APIError, AuthErrorCodes, JWT } from "types/errorCodes";
import * as jwt from 'jsonwebtoken'
import UserEmailService from "./UserEmailService";
import bcrypt from 'bcryptjs'

class AuthService {

    static async login(email: string, password: string): Promise<JWT> {
        const user = await UserModel.findOne({ email })
        email = email.toLowerCase()

        if (!user) throw new APIError(404, AuthErrorCodes.INVALID_EMAIL)

        const userId = user._id
        const correctPassword = await PasswordService.correctPassword(userId, password)

        if (!correctPassword) throw new APIError(401, AuthErrorCodes.INVALID_PASSWORD)

        const token = await this.signJWT(userId, email)

        return token
    }

    /**
     * Validating input and creating user
     * @param email The email of the new user
     * @param password The password of the new user
     * @param repassword Should be the same as password
     * @returns a JWT-token
     */
    static async signUp(email: string, password: string, repassword: string): Promise<JWT> {
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
            password: encryptedPassword
        })

        const token: JWT = await AuthService.signJWT(newUser._id, email)

        return token
    }

    static async signJWT(userId: string, email: string): Promise<JWT> {
        
        const payload: jwt.JwtPayload = {
            user_id: userId,
            email: email
        }

        const secretKey = process.env.TOKEN_KEY


        const options = {
            expiresIn: "2h"
        }

        const token = jwt.sign(payload, secretKey, options)

        return token
    }

}

export default AuthService