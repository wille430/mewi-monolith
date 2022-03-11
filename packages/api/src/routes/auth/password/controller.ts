import { APIError, AuthErrorCodes } from '@mewi/types'
import EmailService from 'services/EmailService'
import { PasswordService, UserEmailService, UserService } from 'services/UserServices'

export const resetPassword = async (req, res, next) => {
    const { userId, newPassword, passwordConfirm, token } = req.body

    await PasswordService.updatePassword(userId, newPassword, passwordConfirm, token).catch(next)

    res.sendStatus(200)
}

export const forgottenPassword = async (req, res, next) => {
    const { sendEmail, email } = req.body

    if (!UserEmailService.validate(email)) {
        return next(new APIError(422, AuthErrorCodes.INVALID_EMAIL))
    }

    const user = await UserService.findUser({ email }).catch(next)
    const resetToken = await PasswordService.createResetToken(user._id).catch(next)

    if (sendEmail !== false) {
        await EmailService.sendForgottenPasswordEmail(user._id, user.email, resetToken)
    }

    res.status(200).json({
        token: resetToken,
    })
}
