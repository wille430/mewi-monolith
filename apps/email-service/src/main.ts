import "reflect-metadata"
import {Channel, ConsumeMessage} from "amqplib"
import * as dotenv from "dotenv"
import {getConnection} from "./connection"
import {EmailService} from "./services/EmailService"
import {container} from "tsyringe"
import {SendEmailDto,MQQueues} from "@mewi/mq-dtos"

const consumer = (channel: Channel, emailService: EmailService) => async (msg: ConsumeMessage | null): Promise<void> => {
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

const startup = () => {

    dotenv.config()

    getConnection().then(async (conn) => {
        const channel: Channel = await conn.createChannel()
        await channel.assertQueue(MQQueues.SendEmail)


        const emailService = container.resolve(EmailService)
        await channel.consume(MQQueues.SendEmail, consumer(channel, emailService))
    })
}

startup()