import puppeteer, { ElementHandle } from 'puppeteer'
import { ListingScraper } from './ListingScraper'
import { ScrapedListing } from './ListingScraper'
import { NotImplementedException } from '@nestjs/common'

export class ListingWebCrawler extends ListingScraper {
    private listingSelector: string
    readonly useRobots: boolean = false

    public override async getBatch(): Promise<ScrapedListing[]> {
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
}
