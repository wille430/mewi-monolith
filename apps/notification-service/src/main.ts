import * as dotenv from "dotenv"
import {SendEmailDto, MQQueues, MessageBroker} from "@mewi/mqlib"
import {WatchersNotificationService} from "./services/WatchersNotificationService"
import {connectMongoose} from "./dbConnection"

const startup = async () => {
    dotenv.config()

    await connectMongoose()

    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const watchersNotificationService = new WatchersNotificationService()
    await mb.consume<SendEmailDto>(MQQueues.NotifyWatchers, watchersNotificationService.notifyAll)
}

// noinspection JSIgnoredPromiseFromCall
startup()