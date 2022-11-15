import Email from 'email-templates'
import { EmailTemplate } from '../enums/email-template.enum'

export class SendEmailResultDto<T> {
    sent!: boolean
    emailRecordId?: string
    template!: EmailTemplate
    // TODO: make type safe
    info!: Awaited<ReturnType<Email['send']>>
    arguments?: T
}
