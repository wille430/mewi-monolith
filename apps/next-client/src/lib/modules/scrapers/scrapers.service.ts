import {autoInjectable, inject} from 'tsyringe'
import {ListingsRepository} from '../listings/listings.repository'
import {MessageBroker, MQQueues, RunScrapeDto} from "@mewi/mqlib"

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
}
