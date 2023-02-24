import * as dotenv from "dotenv"
import {SendEmailDto, MQQueues, MessageBroker} from "@mewi/mqlib"
import {WatchersNotificationService} from "./services/WatchersNotificationService"
import {connectMongoose} from "./dbConnection"
import {FilteringService} from "@mewi/business"

const startup = async () => {
    dotenv.config()

    await connectMongoose()

    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const watchersNotificationService = new WatchersNotificationService(new FilteringService(), new MessageBroker(process.env.MQ_CONNECTION_STRING))

    await mb.consume<SendEmailDto>(MQQueues.NotifyWatchers, async (_) => {
        try {
            await watchersNotificationService.notifyAll()
        } catch (e) {
            console.error(e)
        }
    })
}

// noinspection JSIgnoredPromiseFromCall
startup()