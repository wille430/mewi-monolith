import {EmailTemplate} from "@mewi/models"

export class SendEmailDto {
    userEmail!: string
    userId!: string
    subject!: string
    emailTemplate!: EmailTemplate // TODO: fix TS package for email templates
    locals!: any
}