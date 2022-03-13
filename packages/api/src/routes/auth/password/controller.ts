import { APIError, AuthErrorCodes } from '@mewi/types'
import EmailService from 'services/EmailService'
import { PasswordService, UserEmailService, UserService } from 'services/UserServices'

export const changePassword = async (req, res, next) => {
    try {
        const { userId, newPassword, passwordConfirm, token } = req.body

        await PasswordService.updatePassword(userId, newPassword, passwordConfirm, token)

        res.sendStatus(200)
    } catch (e) {
        return next(e)
    }
}

export const forgottenPassword = async (req, res, next) => {
    try {
        const { sendEmail, email } = req.body

        if (!UserEmailService.validate(email)) {
            throw new APIError(422, AuthErrorCodes.INVALID_EMAIL)
        }

        const user = await UserService.findUser({ email })
        const resetToken = await PasswordService.createResetToken(user._id)

        if (sendEmail !== false) {
            await EmailService.sendForgottenPasswordEmail(user._id, user.email, resetToken)
        }

        res.sendStatus(200)
    } catch (e) {
        return next(e)
    }
}
