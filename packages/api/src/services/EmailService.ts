import NodeMailer from 'nodemailer'
import EmailTemplate from 'email-templates'
import path from 'path'
import fs from 'fs'

export default class EmailService {
    static googleAuth = {
        email: process.env.GMAIL_MAIL,
        pass: process.env.GMAIL_PASS,
    }

    static findTemplateDir() {
        const templatePath = path.resolve('packages/api/src/emails')
        if (fs.existsSync(templatePath)) {
            // template path for non-compiled project
            return templatePath
        } else {
            // template path in out-dir
            return 'emails'
        }
    }

    static newWatchersTemplatePath = EmailService.findTemplateDir() + '/newItems'

    static async sendEmailWithItems(email: string, watcher, items, totalCount?: number) {

        const locals = {
            newItemCount: totalCount || items.length,
            keyword: watcher.metadata.keyword,
            items: items,
        }

        const info = await this.sendEmail(email, this.newWatchersTemplatePath, locals)

        console.log('Preview URL: %s', NodeMailer.getTestMessageUrl(info))
    }

    static async sendEmail(to: string, template: string, locals, test = false) {
        let transporter
        if (test || process.env.NODE_ENV === 'development') {
            const account = await NodeMailer.createTestAccount()

            transporter = NodeMailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
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
        })

        const emailInfo = await email.send({
            template: this.findTemplateDir() + '/' + template,
            message: {
                to: to,
            },
            locals: locals,
        })

        const info = await transporter.sendMail(emailInfo.originalMessage)

        return info
    }
}
