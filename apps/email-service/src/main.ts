import "reflect-metadata"
import {Channel, ConsumeMessage} from "amqplib"
import * as dotenv from "dotenv"
import {EmailService} from "./services/EmailService"
import {container} from "tsyringe"
import {SendEmailDto, MQQueues, MessageBroker} from "@mewi/mqlib"

const sendEmailConsumer = (channel: Channel, emailService: EmailService) => async (msg: ConsumeMessage | null): Promise<void> => {
    if (msg) {
        let content: SendEmailDto
        try {
            content = JSON.parse(msg.content.toString()) as SendEmailDto
        } catch (e) {
            console.error("Could not parse message content")
            channel.reject(msg, false)
            return
        }

        await emailService.trySendEmail(content)
        channel.ack(msg)
    }
}

const startup = async () => {
    dotenv.config()
    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const emailService = container.resolve(EmailService)
    await mb.consume(MQQueues.SendEmail, sendEmailConsumer, emailService)
}

// noinspection JSIgnoredPromiseFromCall
startup()