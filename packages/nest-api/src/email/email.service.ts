import { Injectable } from '@nestjs/common'
import nodeMailer from 'nodemailer'
import path from 'path'

@Injectable()
export class EmailService {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    constructor() {}

    googleAuth = {
        email: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS,
    }

    templatesDir = '../emails'

    templates = {
        forgottenPassword: path.resolve(__dirname, this.templatesDir, 'forgottenPassword'),
        newItems: path.resolve(__dirname, this.templatesDir, 'newItems'),
        verifyEmail: path.resolve(__dirname, this.templatesDir, 'verifyEmail'),
    }

    async transporter(real?: boolean) {
        if (!real && process.env.NODE_ENV !== 'production') {
            const account = await nodeMailer.createTestAccount()

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
                service: 'gmail',
                auth: {
                    user: this.googleAuth.email,
                    pass: this.googleAuth.pass,
                },
            })
        }
    }
}
