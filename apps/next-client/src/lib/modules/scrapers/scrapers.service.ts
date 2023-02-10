import type {FilterQuery} from 'mongoose'
import {autoInjectable, inject} from 'tsyringe'
import {ScrapingLogsRepository} from './scraping-logs.repository'
import type {ScrapingLog} from '../schemas/scraping-log.schema'
import {ListingsRepository} from '../listings/listings.repository'
import {ScrapeNextQuery} from './dto/scrape-next-query.dto'
import {MessageBroker, MQQueues, RunScrapeDto} from "@mewi/mqlib"
import {ListingOrigin} from "@mewi/models"

@autoInjectable()
export class ScrapersService {
    private readonly messageBroker: MessageBroker

    constructor(
        @inject(ListingsRepository) private listingsRepository: ListingsRepository,
        @inject(ScrapingLogsRepository) private scrapingLogsRepository: ScrapingLogsRepository
    ) {
        this.messageBroker = new MessageBroker(process.env.MQ_CONNECTION_STRING)
    }

    /**
     * Scrapes the next endpoint
     */
    async scrapeNext(args: ScrapeNextQuery = {}): Promise<void> {
        // TODO: validate endpoint
        /*
        if (identifier && !this.endPointScraperMap[identifier]) {
            throw new NotFoundException(`There is not endpoint with name ${identifier}`)
        }
         */

        /*
        const endPoint = identifier
            ? this.endPoints.find((o) => o.getIdentifier() == identifier)!
            : (await this.getNextEndPoint()) ?? this.endPoints[0]
         */

        // TODO: variable input
        const msg = new RunScrapeDto()
        msg.scrapeAmount = 40
        msg.endpoint = "BlocketEndPoint"
        msg.origin = ListingOrigin.Blocket
        await this.messageBroker.sendMessage(MQQueues.RunScrape, msg)

        /*
           const log = await this.scrapingLogsRepository.create({
            addedCount,
            entryPoint: endPoint.getIdentifier(),
            errorCount: 0,
            origin: this.endPointScraperMap[endPoint.getIdentifier()].origin,
        })

        return {
            scrapingLog: log.toObject(),
            totalCount: await this.listingsRepository.count({
                entryPoint: endPoint.getIdentifier(),
            }),
        }
         */
    }

    /**
     * Find the index of the last scraped scraper.
     *
     * @returns Index of the last scraped scraper. Returns 0 if no logs were found.
     */
    async getNextEndPoint(): Promise<string | undefined> {
        const log = await this.scrapingLogsRepository.findOne(
            {},
            {},
            {
                sort: {
                    createdAt: -1,
                },
            }
        )

        if (!log) {
            return undefined
        }

        // TODO: calculate next
        return log.entryPoint
    }

    async getLogs(dto: FilterQuery<ScrapingLog>) {
        return await this.scrapingLogsRepository.find(dto)
    }
}
