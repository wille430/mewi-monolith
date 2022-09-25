import { Injectable } from '@nestjs/common'
import nodeMailer from 'nodemailer'
import * as path from 'path'

@Injectable()
export class EmailService {
    credentials = {
        email: process.env.GMAIL_MAIL ?? 'email@test.com',
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
}
