import {EmailTemplate} from '@mewi/email-templates'

export class SendEmailResultDto<T> {
    emailRecordId?: string
    template!: EmailTemplate
    // TODO: make type safe
    arguments?: T
}
