import type {FilterQuery} from 'mongoose'
import {autoInjectable, inject} from 'tsyringe'
import type {ScrapingLog} from '../schemas/scraping-log.schema'
import {ListingsRepository} from '../listings/listings.repository'
import {MessageBroker, MQQueues, RunScrapeDto} from "@mewi/mqlib"
import {ScrapingLogModel} from "../schemas/scraping-log.schema"

@autoInjectable()
export class ScrapersService {
    private readonly messageBroker: MessageBroker

    constructor(
        @inject(ListingsRepository) private listingsRepository: ListingsRepository,
    ) {
        this.messageBroker = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    }

    /**
     * Scrapes the next endpoint
     */
    async scrapeNext(): Promise<void> {
        const msg = new RunScrapeDto()
        msg.scrapeAmount = 500
        await this.messageBroker.sendMessage(MQQueues.RunScrape, msg)
    }

    async getLogs(dto: FilterQuery<ScrapingLog>) {
        return ScrapingLogModel.find(dto)
    }
}
