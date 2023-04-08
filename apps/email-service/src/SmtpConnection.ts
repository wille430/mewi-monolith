import * as nodeMailer from "nodemailer";
import {TestAccount, Transporter} from "nodemailer";
import {SmtpConfig} from "./SmtpConfig";

export class SmtpConnection {
    private smtpConfig: SmtpConfig;

    private account?: TestAccount;
    private transport: Transporter;

    constructor() {
        this.smtpConfig = SmtpConfig.getInstance();
    }

    public getUsername() {
        return this.smtpConfig.cred.username;
    }

    public async getTransport() {
        if (!this.transport) {
            this.transport = await this.createTransport();
        }

        return this.transport;
    }

    private async getTestAccount(): Promise<TestAccount> {
        if (!this.account) {
            this.account = await nodeMailer.createTestAccount();
        }

        return this.account;
    }

    private async createTransport() {
        if (process.env.NODE_ENV !== "production") {
            const account = await this.getTestAccount();

            console.log(
                "Created email test account. Log in with the following credentials:"
            );
            console.log("Email:", account.user);
            console.log("Password:", account.pass);

            return nodeMailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass,
                },
            });
        } else {
            return nodeMailer.createTransport({
                host: this.smtpConfig.host,
                port: 465,
                secure: true,
                auth: {
                    user: this.smtpConfig.cred.username,
                    pass: this.smtpConfig.cred.password,
                },
            });
        }
    }
}