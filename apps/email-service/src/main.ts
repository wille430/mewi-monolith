import "reflect-metadata"
import * as dotenv from "dotenv"
import {EmailService} from "./services/EmailService"
import {container} from "tsyringe"
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib"

const startup = async () => {
    dotenv.config()
    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const emailService = container.resolve(EmailService)
    await mb.consume<SendEmailDto>(MQQueues.SendEmail, async (msg) => {
        const success = await emailService.trySendEmail(msg)
        if (success) {
            console.log(
                `Sent an email to ${msg.userEmail}. Subject=${msg.subject} Template=${msg.emailTemplate}`
            )
        } else {
            console.log(
                `Failed to send an email to ${msg.userEmail}. Subject=${msg.subject} Template=${msg.emailTemplate} Locals=${msg.locals}`
            )
        }
    })
}

// noinspection JSIgnoredPromiseFromCall
startup()