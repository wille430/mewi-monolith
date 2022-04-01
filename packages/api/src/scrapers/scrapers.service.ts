import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { BlocketScraper } from './blocket.scraper'
import { Model } from 'mongoose'
import { Listing, ListingDocument } from '@/listings/listing.schema'
import { ListingOrigins } from '@mewi/common/types'

@Injectable()
export class ScrapersService {
    scrapers: BlocketScraper[] = []

    constructor(@InjectModel(Listing.name) listingModel: Model<ListingDocument>) {
        this.scrapers = [new BlocketScraper(listingModel)]
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
            return false
        }
    }
}
