import NodeMailer from 'nodemailer'
import EmailTemplate from 'email-templates'
import fs from 'fs'
import path from 'path'
import { ItemData, PublicWatcher } from '@mewi/types'

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

    static async sendEmailWithItems(
        email: string,
        watcher: PublicWatcher,
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
    static async sendEmail(to: string, template: string, locals, test = false) {
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
            preview: false,
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
}
