import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BlocketScraper } from './blocket.scraper'
import { Model } from 'mongoose'
import { Listing, ListingDocument } from '@/listings/listing.schema'
import { ListingOrigins } from '@wille430/common'
import { TraderaScraper } from './tradera.scraper'
import { SellpyScraper } from './sellpy.scraper'
import { BlippScraper } from './blipp.scraper'
import { Scraper, ScraperOptions } from './scraper'

const isProduction = process.env.NODE_ENV === 'production'

export const ScraperOption: Record<ListingOrigins, ScraperOptions> = {
    Blocket: {
        limit: isProduction ? 5000 : 10,
    },
    Tradera: {
        limit: isProduction ? 1000 : 10,
    },
    Sellpy: {
        limit: isProduction ? 1000 : 10,
    },
    Blipp: {
        limit: isProduction ? 250 : 10,
    },
}

@Injectable()
export class ScrapersService {
    scrapers: Scraper[] = []

    constructor(@InjectModel(Listing.name) listingModel: Model<ListingDocument>) {
        this.scrapers = [
            new BlocketScraper(listingModel, ScraperOption.Blocket),
            new TraderaScraper(listingModel, ScraperOption.Tradera),
            new SellpyScraper(listingModel, ScraperOption.Sellpy),
            new BlippScraper(listingModel, ScraperOption.Blipp),
        ]
    }

    scheduleAll() {
        for (const scraper of this.scrapers) {
            scraper.schedule()
        }
    }

    async startAll() {
        for (const scraper of this.scrapers) {
            await scraper.start()
        }
    }

    start(scraperName: ListingOrigins) {
        let foundScraper: typeof this.scrapers[number] | undefined = undefined

        for (const scraper of this.scrapers) {
            if (scraper.name === scraperName) {
                foundScraper = scraper
            }
        }

        if (foundScraper) {
            foundScraper.start()
            return true
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: [`no scraper named ${scraperName}`],
                error: 'Not Found',
            })
        }
    }
}
