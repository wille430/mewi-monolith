import { Injectable, NotFoundException } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'
import { ListingOrigin } from '@mewi/prisma'
import { ScraperStatus } from '@wille430/common'
import { BlocketScraper } from './blocket.scraper'
import { TraderaScraper } from './tradera.scraper'
import { SellpyScraper } from './sellpy.scraper'
import { BlippScraper } from './blipp.scraper'
import { Scraper } from './scraper'
import { PrismaService } from '@/prisma/prisma.service'

@Injectable()
export class ScrapersService {
    scrapers: Scraper[] = []

    constructor(
        private blocketScraper: BlocketScraper,
        private traderaScraper: TraderaScraper,
        private blippScraper: BlippScraper,
        private sellpyScraper: SellpyScraper,
        private prisma: PrismaService
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

    async start(scraperName: ListingOrigin): Promise<ScraperStatus> {
        let foundScraper: typeof this.scrapers[number] | undefined = undefined

        for (const scraper of this.scrapers) {
            if (scraper.name === scraperName) {
                foundScraper = scraper
            }
        }

        if (foundScraper) {
            foundScraper.start()
            const listingCount = await this.prisma.listing.count({
                where: {
                    origin: foundScraper.name,
                },
            })

            return {
                started: true,
                listings_current: listingCount,
                listings_remaining: foundScraper.maxEntries - listingCount,
            }
        } else {
            throw new NotFoundException({
                statusCode: 404,
                message: [`no scraper named ${scraperName}`],
                error: 'Not Found',
            })
        }
    }

    async status(): Promise<Record<ListingOrigin, ScraperStatus>> {
        const allScraperStatus: Partial<ReturnType<typeof this.status>> = {}

        for (const key of Object.keys(ListingOrigin)) {
            const scraper = this.scrapers.find((x) => x.name === key)

            const listingCount = await this.prisma.listing.count({
                where: {
                    origin: key as ListingOrigin,
                },
            })

            allScraperStatus[key] = {
                started: scraper.isScraping,
                listings_current: listingCount,
                listings_remaining: scraper.maxEntries - listingCount,
            }
        }

        return allScraperStatus as ReturnType<typeof this.status>
    }
}
