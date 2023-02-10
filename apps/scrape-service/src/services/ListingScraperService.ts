import {ListingModel} from "@mewi/entities"
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

export class ListingScraperService {
    // 14 days
    private DELETE_OLDER_THAN = 14 * 24 * 60 * 60 * 1000

    async scrape(args: RunScrapeDto) {
        const {origin, endpoint, scrapeAmount} = args
        // validate args
        if (!Object.values(ListingOrigin).includes(origin)) throw Error(`origin must be a valid enum value`)
        if (endpoint == null) throw Error(`endpoint must be a non-null string`)
        if (scrapeAmount == null) throw Error(`scrapeAmount must be a non-null number`)

        // run scraper
        const scraper = this.getScraper(origin)
        const {entities} = await scraper.scrapeEndpoint(args.endpoint, scrapeAmount)

        // remove old
        await this.removeOld()
        // remove already existing listings with same origin id
        await this.removeListings(entities.map(({origin_id}) => origin_id))

        // create entities
        await ListingModel.create(entities)

        // create scrape log (deprecate?)
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

    private getScraper(origin: ListingOrigin) {
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
