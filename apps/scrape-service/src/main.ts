import * as dotenv from "dotenv";
import { ListingScraperService } from "./services/ListingScraperService";
import { connectMongoose } from "./dbConnection";
import "reflect-metadata";
import { container } from "tsyringe";
import { CronJob } from "cron";
import { RunScrapeDto } from "./services/RunScrapeDto";
import { checkRequiredEnvVars } from "@mewi/utilities/dist/checkRequiredEnvVars";

const startup = async () => {
  dotenv.config();

  checkRequiredEnvVars(["MONGO_URI", "OPENAI_API_KEY"]);

  await connectMongoose();

  const listingScraper = container.resolve(ListingScraperService);
  const job = new CronJob("* */5 * * * *", () => {
    const config = new RunScrapeDto();
    config.scrapeAmount = 500;
    return listingScraper.scrape(config).catch(console.log);
  });

  job.start();
};

// noinspection JSIgnoredPromiseFromCall
startup();
