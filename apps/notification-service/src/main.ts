import * as dotenv from "dotenv";
import { WatchersNotifService } from "./services/WatchersNotifService";
import { connectMongoose } from "./dbConnection";
import { FilteringService } from "@mewi/business";
import * as winston from "winston";
import { NotifFactory } from "./services/NotifFactory";
import { CronJob } from "cron";

const startup = async () => {
  dotenv.config();

  await connectMongoose();

  const logger = winston.createLogger({
    level: "info",
    transports: [new winston.transports.Console()],
  });
  const watchersNotificationService = new WatchersNotifService(
    new FilteringService(logger),
    new NotifFactory()
  );

  const job = new CronJob("* */15 * * * *", async () => {
    try {
      await watchersNotificationService.notifyAll();
    } catch (e) {
      console.error(e);
    }
  });

  job.start();
};

// noinspection JSIgnoredPromiseFromCall
startup();
