import * as dotenv from "dotenv"
import {MessageBroker, MQQueues, RunScrapeDto} from "@mewi/mqlib"
import {ListingScraperService} from "./services/ListingScraperService"
import {connectMongoose} from "./dbConnection"

const startup = async () => {
    dotenv.config()

    await connectMongoose()

    const mb = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    const listingScraper = new ListingScraperService()
    await mb.consume<RunScrapeDto>(MQQueues.RunScrape, (msg) => {
        return listingScraper.scrape(msg).catch(console.log)
    })
}

// noinspection JSIgnoredPromiseFromCall
startup()