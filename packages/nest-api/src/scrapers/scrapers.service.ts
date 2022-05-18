import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin } from '@mewi/prisma'
import { BlocketScraper } from './blocket.scraper'
import { TraderaScraper } from './tradera.scraper'
import { SellpyScraper } from './sellpy.scraper'
import { BlippScraper } from './blipp.scraper'
import { Scraper } from './scraper'

@Injectable()
export class ScrapersService {
    scrapers: Scraper[] = []

    constructor(
        private readonly configService: ConfigService,
        private blocketScraper: BlocketScraper,
        private traderaScraper: TraderaScraper,
        private blippScraper: BlippScraper,
        private sellpyScraper: SellpyScraper
    ) {
        this.scrapers = [
            this.blocketScraper,
            this.traderaScraper,
            this.blippScraper,
            this.sellpyScraper,
        ]
    }

    // scheduleAll() {
    //     for (const scraper of this.scrapers) {
    //         scraper.schedule()
    //     }
    // }

    @Cron('* */45 * * *')
    async startAll() {
        for (const scraper of this.scrapers) {
            await scraper.start()
        }
    }

    start(scraperName: ListingOrigin) {
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
