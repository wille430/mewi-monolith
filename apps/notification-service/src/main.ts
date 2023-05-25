import * as dotenv from "dotenv";
import { WatchersNotifService } from "./services/WatchersNotifService";
import { connectMongoose } from "./dbConnection";
import { FilteringService } from "@mewi/business";
import * as winston from "winston";
import { CronJob } from "cron";
import { configureSMTP, sendEmailTemplate } from "@mewi/email-templates";
import { checkRequiredEnvVars } from "@mewi/utilities/dist/checkRequiredEnvVars";
import { EmailTemplate } from "@mewi/models";

const startup = async () => {
  dotenv.config();

  checkRequiredEnvVars([
    "MONGO_URI",
    "SMTP_HOST",
    "SMTP_USERNAME",
    "SMTP_PASSWORD",
    "CLIENT_URL",
  ]);

  configureSMTP({
    host: process.env.SMTP_HOST,
    secure: true,
    port: 465,
    username: process.env.SMTP_USERNAME,
    password: process.env.SMTP_PASSWORD,
  });

  await connectMongoose();

  const logger = winston.createLogger({
    level: "info",
    transports: [new winston.transports.Console()],
  });
  const watchersNotificationService = new WatchersNotifService(
    new FilteringService(logger)
  );

  await sendEmailTemplate(EmailTemplate.FORGOTTEN_PASSWORD, {
    to: "williamwig@hotmail.se",
    subject: "test",
    locals: {
      clientUrl: "www.mewi.se",
    },
  });

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
