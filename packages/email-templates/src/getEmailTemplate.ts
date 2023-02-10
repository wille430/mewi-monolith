import {ForgottenPasswordTemplate, VerifyEmailTemplate, WatcherNotifyTemplate} from "./templates"
import {EmailTemplate} from "@mewi/models"

export const getEmailTemplate = (emailTemplate: EmailTemplate): (args) => any => {
    switch (emailTemplate) {
        case EmailTemplate.FORGOTTEN_PASSWORD:
            return ForgottenPasswordTemplate
        case EmailTemplate.NEW_ITEMS:
            return WatcherNotifyTemplate
        case EmailTemplate.VERIFY_EMAIL:
            return VerifyEmailTemplate
        default:
            throw new Error(`${emailTemplate} is not a valid enum value`)
    }
}