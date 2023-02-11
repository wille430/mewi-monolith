import {Listing, ListingModel} from "@mewi/entities"
import {RunScrapeDto} from "@mewi/mqlib"
import {ListingOrigin} from "@mewi/models"
import {BlocketScraper} from "../scrapers/Blocket/BlocketScraper"
import {BilwebScraper} from "../scrapers/Bilweb/BilwebScraper"
import {BlippScraper} from "../scrapers/Blipp/BlippScraper"
import {BytbilScraper} from "../scrapers/Bytbil/BytbilScraper"
import {CitiboardScraper} from "../scrapers/Citiboard/CitiboardScraper"
import {KvdBilScraper} from "../scrapers/KvdBil/KvdBilScraper"
import {SellpyScraper} from "../scrapers/Sellpy/SellpyScraper"
import {ShpockScraper} from "../scrapers/Shpock/ShpockScraper"
import {TraderaScraper} from "../scrapers/Tradera/TraderaScraper"
import {Scraper} from "../scrapers/Scraper"
import {floor} from "lodash"

export class ListingScraperService {
    // 14 days
    private DELETE_OLDER_THAN = 14 * 24 * 60 * 60 * 1000

    async scrape(args: RunScrapeDto) {
        const {origin, endpoint, scrapeAmount} = args
        if (origin == null && endpoint == null && scrapeAmount != null && Number.isInteger(scrapeAmount)) {
            return this.scrapeAll(args)
        }

        // validate args
        if (scrapeAmount == null || !Number.isInteger(scrapeAmount)) throw Error(`scrapeAmount must be a non-null number`)
        if (!Object.values(ListingOrigin).includes(origin)) throw Error(`origin must be a valid enum value`)

        if (endpoint == null) {
            return this.scrapeOrigin(origin, scrapeAmount)
        }

        if (typeof endpoint != 'string') throw Error(`endpoint must be a non-null string`)
        await this.scrapeEndpoint(args)
    }

    private async scrapeOrigin(origin: ListingOrigin, scrapeAmount: number) {
        const scraper = this.getScraper(origin)
        const endpoints = scraper.getEndpoints()
        const scrapeAmountEndpoint = floor(scrapeAmount / endpoints.length)

        console.log(`Scraping ${scrapeAmount} listings from ${origin}...`)

        const listings = []
        for (const endpoint of endpoints) {
            try {
                const {entities} = await endpoint.scrape(scrapeAmountEndpoint)
                listings.push(...entities)
            } catch (e) {
                console.error(e)
            }
        }

        console.log(`Successfully scraped ${listings.length} listings from ${origin}`)
        await this.createListings(listings)
    }

    private async scrapeEndpoint(args: RunScrapeDto) {
        const {origin, endpoint, scrapeAmount} = args

        console.log(`Scraping ${scrapeAmount} listings from ${origin} (${endpoint})...`)

        // run scraper
        const scraper = this.getScraper(origin)
        const {entities} = await scraper.scrapeEndpoint(endpoint, scrapeAmount)
        await this.createListings(entities)

        console.log(`Successfully scraped ${entities.length} listings from ${origin}`)
    }

    private async createListings(entities) {
        // remove old
        await this.removeOld()
        // remove already existing listings with same origin id
        await this.removeListings(entities.map(({origin_id}) => origin_id))
        await ListingModel.create(entities)
    }

    private async scrapeAll(args: RunScrapeDto) {
        const start = Date.now()
        const {scrapeAmount} = args

        const scrapeAmountScraper = floor(scrapeAmount / Object.keys(ListingOrigin).length)
        console.log(`Scraping ${scrapeAmount} listings from all endpoints (${scrapeAmountScraper} from each website)...`)

        for (const origin of Object.values(ListingOrigin)) {
            const scraper = this.getScraper(origin)
            const endpoints = scraper.getEndpoints()

            const scrapeAmountEndpoint = scrapeAmountScraper / endpoints.length
            const listings = []

            for (const endpoint of endpoints) {
                try {
                    const {entities} = await endpoint.scrape(scrapeAmountEndpoint)
                    listings.push(...entities)
                } catch (e) {
                    console.error(e)
                }
            }
            await this.createListings(listings)
        }

        console.log(`Finished scraping all endpoints. It took ${(Date.now() - start) / 1000}s`)
    }

    private async removeListings(ids: string[]) {
        return ListingModel.deleteMany({
            origin_id: {
                $in: ids,
            },
        })
    }

    private async removeOld() {
        return ListingModel.deleteMany({
            createdAt: {
                $lt: new Date(Date.now() - this.DELETE_OLDER_THAN).toISOString(),
            },
        })
    }

    private getScraper(origin: ListingOrigin): Scraper<Listing> {
        switch (origin) {
            case ListingOrigin.Blocket:
                return new BlocketScraper()
            case ListingOrigin.Bilweb:
                return new BilwebScraper()
            case ListingOrigin.Blipp:
                return new BlippScraper()
            case ListingOrigin.Bytbil:
                return new BytbilScraper()
            case ListingOrigin.Citiboard:
                return new CitiboardScraper()
            case ListingOrigin.Kvdbil:
                return new KvdBilScraper()
            case ListingOrigin.Sellpy:
                return new SellpyScraper()
            case ListingOrigin.Shpock:
                return new ShpockScraper()
            case ListingOrigin.Tradera:
                return new TraderaScraper()
            default:
                throw new Error(`${origin} is not a valid enum value`)
        }
    }
}
