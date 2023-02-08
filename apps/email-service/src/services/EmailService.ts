import * as nodeMailer from 'nodemailer'
import type {TestAccount} from 'nodemailer'
import {autoInjectable} from 'tsyringe'
import * as Email from "email-templates"
import {getEmailTemplate} from "@mewi/email-templates"
import {SendEmailDto} from "@mewi/mq-dtos/src/SendEmailDto"
import * as assert from "assert"

@autoInjectable()
export class EmailService {

    private readonly smtpCredentials = {
        username: process.env.SMTP_USERNAME,
        password: process.env.SMTP_PASSWORD
    }
    private readonly senderEmail = this.smtpCredentials.username

    private readonly smtpHost = process.env.SMTP_HOST

    constructor() {
        if (process.env.NODE_ENV === "production") {
            assert(process.env.SMTP_USERNAME)
            assert(process.env.SMTP_PASSWORD)
            assert(process.env.SMTP_HOST)
        }
        assert(process.env.CLIENT_URL)
    }

    private _account?: TestAccount

    async getTestAccount(): Promise<TestAccount> {
        if (!this._account) {
            this._account = await nodeMailer.createTestAccount()
        }

        return this._account
    }

    async createTransport() {
        if (process.env.NODE_ENV !== 'production') {
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
                host: this.smtpHost,
                port: 465,
                secure: true,
                auth: {
                    user: this.smtpCredentials.username,
                    pass: this.smtpCredentials.password,
                },
            })
        }
    }

    async trySendEmail(dto: SendEmailDto): Promise<boolean> {
        try {

            const {emailTemplate, userEmail, locals, subject} = dto
            const transport = await this.createTransport()

            const email = new Email({
                message: {
                    from: this.senderEmail
                },
                transport
            })

            const templateFunc = getEmailTemplate(emailTemplate)

            const info = await email.send({
                message: {
                    to: userEmail,
                    subject: subject,
                    html: templateFunc({
                        ...locals,
                        clientUrl: process.env.CLIENT_URL
                    }).html,
                },
                locals: locals,
            })

            await transport.sendMail(info.originalMessage)


            if (process.env.NODE_ENV === 'development') {
                console.log('Email preview:', nodeMailer.getTestMessageUrl(info))
            }

            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}
