import * as nodeMailer from "nodemailer";
import {autoInjectable, inject} from "tsyringe";
import * as Email from "email-templates";
import {getEmailTemplate} from "@mewi/email-templates";
import {SendEmailDto} from "@mewi/mqlib";
import * as assert from "assert";
import {SmtpConnection} from "./SmtpConnection";

@autoInjectable()
export class EmailService {
    constructor(
        @inject(SmtpConnection) private readonly smtpConnection: SmtpConnection
    ) {
        assert(process.env.CLIENT_URL);
    }

    async trySendEmail(dto: SendEmailDto): Promise<boolean> {
        try {
            const {emailTemplate, userEmail, locals, subject} = dto;
            const transport = await this.smtpConnection.getTransport();

            const email = new Email({
                message: {
                    from: this.smtpConnection.getUsername(),
                },
                transport,
            });

            const templateFunc = getEmailTemplate(emailTemplate);

            const info = await email.send({
                message: {
                    to: userEmail,
                    subject: subject,
                    html: templateFunc({
                        ...locals,
                        clientUrl: process.env.CLIENT_URL,
                    }).html,
                },
                locals: locals,
            });

            if (process.env.NODE_ENV === "development") {
                console.log("Email preview:", nodeMailer.getTestMessageUrl(info));
            }

            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}
