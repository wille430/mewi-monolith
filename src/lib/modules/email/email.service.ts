import nodeMailer from 'nodemailer'
import type { TestAccount } from 'nodemailer'
import { autoInjectable, inject } from 'tsyringe'
import { EmailTemplate } from './enums/email-template.enum'
import Email, { EmailOptions } from 'email-templates'
import { SendEmailResultDto } from './dto/send-email-result.dto'
import { EmailRecordsRepository } from './email-records.repository'
import { User } from '../schemas/user.schema'
import { verifyEmailTemplate } from './templates/verifyEmailTemplate'

type SendEmailOptions = EmailOptions & {
    createRecord?: boolean
    send?: boolean
}

@autoInjectable()
export class EmailService {
    private credentials = {
        email: process.env.GMAIL_MAIL ?? 'email@test.com',
        pass: process.env.GMAIL_PASS,
    }

    constructor(
        @inject(EmailRecordsRepository)
        private readonly emailRecordsRepository: EmailRecordsRepository
    ) {}

    getTemplate(template: EmailTemplate) {
        switch (template) {
            case EmailTemplate.VERIFY_EMAIL:
                return verifyEmailTemplate
            case EmailTemplate.NEW_ITEMS:
                throw new Error('Not implemented')
            case EmailTemplate.FORGOTTEN_PASSWORD:
                throw new Error('Not implemented')
        }
    }

    private _account?: TestAccount
    async getTestAccount(): Promise<TestAccount> {
        if (!this._account) {
            this._account = await nodeMailer.createTestAccount()
        }

        return this._account
    }

    async createTransport(real?: boolean) {
        if (!real && process.env.NODE_ENV !== 'production') {
            const account = await this.getTestAccount()

            console.log('Created email test account. Log in with the following credentials:')
            console.log('Email:', account.user)
            console.log('Password:', account.pass)

            return nodeMailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            })
        } else {
            return nodeMailer.createTransport({
                host: 'send.one.com',
                port: 465,
                secure: true,
                auth: {
                    user: this.credentials.email,
                    pass: this.credentials.pass,
                },
            })
        }
    }

    async sendEmail<T>(
        toUser: User,
        subject: string,
        locals: T,
        template: EmailTemplate,
        options: SendEmailOptions = { createRecord: true, send: true }
    ): Promise<SendEmailResultDto<T>> {
        const { createRecord, send } = options
        const transport = await this.createTransport()

        const email = new Email({
            message: {
                from: this.credentials.email,
            },
            transport,
        })

        const templatePath = this.getTemplate(template)

        const info = await email.send({
            ...options,
            message: {
                to: toUser.email,
                subject: subject,
                html: templatePath(locals as any).html,
                ...options?.message,
            },
            locals: locals,
        })

        let emailRecordId: string | undefined = undefined
        if (createRecord) {
            const emailRecord = await this.emailRecordsRepository.create({
                template,
                arguments: locals,
                user: toUser,
            })
            emailRecordId = emailRecord.id
        }

        if (send) {
            await transport.sendMail(info.originalMessage)

            if (process.env.NODE_ENV === 'development') {
                console.log('Email preview:', nodeMailer.getTestMessageUrl(info))
            }
        }

        return {
            info: info,
            sent: send ?? false,
            template,
            arguments: locals,
            emailRecordId: emailRecordId,
        }
    }
}
