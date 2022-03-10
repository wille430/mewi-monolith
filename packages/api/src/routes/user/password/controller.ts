import EmailService from 'services/EmailService'
import { PasswordService, UserService } from 'services/UserServices'

export const resetPassword = async (req, res, next) => {
    const { newPassword, token } = req.body
    const { user_id: userId } = req.user

    await PasswordService.updatePassword(userId, newPassword, token).catch(next)

    res.status(200)
}

export const forgottenPassword = async (req, res, next) => {
    const { sendEmail } = req.body
    const { user_id } = req.user

    const resetToken = await PasswordService.createResetToken(user_id).catch(next)
    const user = await UserService.user(user_id)

    if (sendEmail !== false) {
        await EmailService.sendForgottenPasswordEmail(user.email, resetToken)
    }

    res.status(200).json({
        token: resetToken,
    })
}
