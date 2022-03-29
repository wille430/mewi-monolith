import NodeMailer from 'nodemailer'
import EmailTemplate from 'email-templates'
import fs from 'fs'
import path from 'path'
import { ItemData, IWatcher } from '@mewi/common'

export default class EmailService {
    static googleAuth = {
        email: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS,
    }

    static templatesDirectory() {
        if (fs.existsSync(path.join(__dirname, 'emails'))) {
            return path.join(__dirname, 'emails')
        } else {
            return path.resolve(__dirname, '../emails')
        }
    }

    static newWatchersTemplatePath = this.templatesDirectory() + '/newItems'
    static forgottenPasswordTemplate = this.templatesDirectory() + '/forgottenPassword'

    static async sendEmailWithItems(
        email: string,
        watcher: IWatcher,
        items: ItemData[],
        totalCount?: number
    ) {
        const locals = {
            newItemCount: totalCount || items.length,
            keyword: watcher.metadata.keyword,
            items: items,
        }

        const info = await this.sendEmail(email, this.newWatchersTemplatePath, locals)

        console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info))
    }

    /**
     *
     * @param to Email of receiver
     * @param template Absolute path to email template
     * @param locals Object of template variables
     * @param test True if email should be sent throught NodeMailer test account
     * @returns
     */
    static async sendEmail(to: string, template: string, locals, test = false, preview = false) {
        let transporter
        if (test || process.env.NODE_ENV !== 'production') {
            const account = await NodeMailer.createTestAccount()

            transporter = NodeMailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            })
        } else {
            transporter = NodeMailer.createTransport({
                service: 'gmail',
                auth: {
                    user: this.googleAuth.email,
                    pass: this.googleAuth.pass,
                },
            })
        }

        const email = new EmailTemplate({
            message: {
                from: this.googleAuth.email,
            },
            transport: transporter,
            preview: preview,
        })

        const emailInfo = await email.send({
            template: template,
            message: {
                to: to,
            },
            locals: locals,
        })

        const info = await transporter.sendMail(emailInfo.originalMessage)

        return info
    }

    static async sendForgottenPasswordEmail(userId: string, email: string, token: string) {
        let link = `/nyttlosenord?token=${token}&userId=${userId}`

        if (process.env.NODE_ENV === 'production') {
            link = 'https://www.mewi.se' + link
        } else {
            link = 'http://localhost:4200' + link
        }

        if (process.env.NODE_ENV === 'production') {
            await this.sendEmail(email, this.forgottenPasswordTemplate, { link })
        } else {
            await this.sendEmail(email, this.forgottenPasswordTemplate, { link }, true, true)
        }
    }
}
