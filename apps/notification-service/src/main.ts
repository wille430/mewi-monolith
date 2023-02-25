import * as dotenv from "dotenv";
import {MessageBroker, MQQueues, SendEmailDto} from "@mewi/mqlib";
import {WatchersNotificationService} from "./services/WatchersNotificationService";
import {connectMongoose} from "./dbConnection";
import {FilteringService} from "@mewi/business";
import * as winston from "winston";

const startup = async () => {
    dotenv.config();

    await connectMongoose();

    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING);
    const logger = winston.createLogger({
        level: "info",
        transports: [new winston.transports.Console()],
    });
    const watchersNotificationService = new WatchersNotificationService(
        new FilteringService(logger),
        new MessageBroker(process.env.MQ_CONNECTION_STRING)
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