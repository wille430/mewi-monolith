import {Listing} from "@mewi/entities"
import {ScrapeResponse} from "../Scraper"
import {validate} from "class-validator"
import {plainToInstance} from "class-transformer"
import {ListingValidator} from "../../models/ListingValidator"
import {AbstractEndPoint} from "../EndPoint"
import {BilwebScraper} from "../Bilweb/BilwebScraper"
import {BlippScraper} from "../Blipp/BlippScraper"
import {BytbilScraper} from "../Bytbil/BytbilScraper"
import {BlocketScraper} from "../Blocket/BlocketScraper"
import {CitiboardScraper} from "../Citiboard/CitiboardScraper"
import {KvdBilScraper} from "../KvdBil/KvdBilScraper"
import {SellpyScraper} from "../Sellpy/SellpyScraper"
import {ShpockScraper} from "../Shpock/ShpockScraper"
import {TraderaScraper} from "../Tradera/TraderaScraper"

describe.each([
    ...BilwebScraper.createEndpoints(),
    ...BlippScraper.createEndpoints(),
    ...BlocketScraper.createEndpoints(),
    ...BytbilScraper.createEndpoints(),
    ...CitiboardScraper.createEndpoints(),
    ...KvdBilScraper.createEndpoints(),
    ...SellpyScraper.createEndpoints(),
    ...ShpockScraper.createEndpoints(),
    ...TraderaScraper.createEndpoints()
])("%s", (endpoint: AbstractEndPoint<any, any, any>) => {

    const scrapeAmount = 10

    describe("#scrape", () => {
        let res: ScrapeResponse<Listing>
        beforeEach(async () => {
            res = await endpoint.scrape(scrapeAmount)
        })

        it("should return an array of listings", async () => {
            expect(Array.isArray(res.entities)).toBe(true)
            expect(res.entities.length).toBe(scrapeAmount)

            let invalidListings = 0
            let hasNoImage = 0
            for (const listing of res.entities) {
                const err = await validate(plainToInstance(ListingValidator, listing))
                if (err.length) {
                    console.error(err)
                    invalidListings++
                }

                if (listing.imageUrl.length == 0) hasNoImage++
            }
            expect(invalidListings).toBe(0)
            // Some listings must at least have an image
            expect(hasNoImage).toBeLessThan(res.entities.length)
        })
    })
})
