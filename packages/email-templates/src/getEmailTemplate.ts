import {ForgottenPasswordTemplate, VerifyEmailTemplate, WatcherNotifyTemplate} from "./templates"
import {EmailTemplate} from "./EmailTemplateEnum"

export const getEmailTemplate = (emailTemplate: EmailTemplate): (args) => any => {
    switch (emailTemplate) {
        case EmailTemplate.FORGOTTEN_PASSWORD:
            return ForgottenPasswordTemplate
            break
        case EmailTemplate.NEW_ITEMS:
            return WatcherNotifyTemplate
            break
        case EmailTemplate.VERIFY_EMAIL:
            return VerifyEmailTemplate
            break
        default:
            throw new Error(`${emailTemplate} is not a valid enum value`)
    }
}