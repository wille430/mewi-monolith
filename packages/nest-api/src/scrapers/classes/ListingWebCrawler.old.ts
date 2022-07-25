import { Prisma } from '@mewi/prisma'
import puppeteer, { ElementHandle } from 'puppeteer'
import axios from 'axios'
import robotsParser from 'robots-parser'
import { NotImplementedException } from '@nestjs/common'
import { ListingScraper, ScrapedListing } from './ListingScraper.old'

export class ListingWebCrawler extends ListingScraper {
    private listingSelector: string
    readonly useRobots: boolean = false

    public override async getBatch(): Promise<Prisma.ListingCreateInput[]> {
        // Instantiate puppeteer
        const browser = await puppeteer.launch({
            args: ['--no-sandbox'],
        })

        try {
            const page = await browser.newPage()
            await page.goto(this.scrapeTargetUrl)

            const items = await page.$$(this.listingSelector)
            const scrapedListings = await Promise.all(
                items.map((ele) => this.evalParseRawListing(ele))
            )

            const listings = scrapedListings.map((x) => ({
                ...x,
                origin: this.origin,
                date: new Date(),
            })) as ScrapedListing[]

            return listings
        } catch (e) {
            console.error(e)
            return []
        } finally {
            await browser.close()
        }
    }

    evalParseRawListing(ele: ElementHandle<Element>): ScrapedListing {
        throw new NotImplementedException()
    }

    async checkPermissions(): Promise<boolean> {
        // skip if useRobots is false
        if (!this.useRobots) {
            return Promise.resolve(true)
        }

        const robotsTxt = await axios.get(this.baseUrl).then((res) => res.data)

        const robots = robotsParser(new URL('robots.txt', this.baseUrl).toString(), robotsTxt)

        if (robots.isAllowed(this.scrapeTargetUrl)) {
            return true
        } else {
            return false
        }
    }
}
