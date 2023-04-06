import * as dotenv from "dotenv";
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib";
import {WatchersNotifService} from "./services/WatchersNotifService";
import {connectMongoose} from "./dbConnection";
import {FilteringService} from "@mewi/business";
import * as winston from "winston";
import {NotifFactory} from "./services/NotifFactory";

const startup = async () => {
    dotenv.config();

    await connectMongoose();

    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING);
    const logger = winston.createLogger({
        level: "info",
        transports: [new winston.transports.Console()],
    });
    const watchersNotificationService = new WatchersNotifService(
        new FilteringService(logger),
        new NotifFactory(mb)
    );

    await mb.consume<SendEmailDto>(MQQueues.NotifyWatchers, async (_) => {
        try {
            await watchersNotificationService.notifyAll();
        } catch (e) {
            console.error(e);
        }
    });
};

// noinspection JSIgnoredPromiseFromCall
startup()