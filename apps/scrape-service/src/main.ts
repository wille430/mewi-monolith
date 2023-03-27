import * as dotenv from "dotenv";
import { MessageBroker, MQQueues, RunScrapeDto } from "@mewi/mqlib";
import { ListingScraperService } from "./services/ListingScraperService";
import { connectMongoose } from "./dbConnection";
import "reflect-metadata";
import { container } from "tsyringe";

const startup = async () => {
  dotenv.config();

  await connectMongoose();

  const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING);
  const listingScraper = container.resolve(ListingScraperService);
  await mb.consume<RunScrapeDto>(MQQueues.RunScrape, (msg) => {
    return listingScraper.scrape(msg).catch(console.log);
  });
};

// noinspection JSIgnoredPromiseFromCall
startup();