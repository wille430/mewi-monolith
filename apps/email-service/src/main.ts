import "reflect-metadata"
import * as dotenv from "dotenv"
import {EmailService} from "./services/EmailService"
import {container} from "tsyringe"
import {SendEmailDto, MQQueues, MessageBroker} from "@mewi/mqlib"

const startup = async () => {
    dotenv.config()
    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const emailService = container.resolve(EmailService)
    await mb.consume<SendEmailDto>(MQQueues.SendEmail, emailService.trySendEmail)
}

// noinspection JSIgnoredPromiseFromCall
startup()