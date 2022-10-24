import type { TestingModule } from '@nestjs/testing'
import { Test } from '@nestjs/testing'
import * as _ from 'lodash'
import { ListingOrigin } from '@wille430/common'
import { validateListingTest } from '../validate-listing.spec'
import { ListingsRepository } from '@/listings/listings.repository'
import { ScrapingLogsRepository } from '@/scrapers/scraping-logs.repository'
import type { BaseListingScraper } from '@/scrapers/classes/BaseListingScraper'
import type { BaseEntryPoint } from '@/scrapers/classes/BaseEntryPoint'
import { AppModule } from '@/app.module'
import { ScrapersService } from '@/scrapers/scrapers.service'

const testScrapers = Object.values(ListingOrigin).map((x) => [x])

describe('Scraper Integration', () => {
    describe.each(testScrapers)(`%s`, (origin) => {
        let listingsRepository: ListingsRepository
        let scrapingLogsRepository: ScrapingLogsRepository
        let scraper: BaseListingScraper

        beforeAll(async () => {
            const module: TestingModule = await Test.createTestingModule({
                imports: [AppModule],
            }).compile()

            listingsRepository = module.get<ListingsRepository>(ListingsRepository)
            scrapingLogsRepository = module.get<ScrapingLogsRepository>(ScrapingLogsRepository)
            const scrapersService = module.get<ScrapersService>(ScrapersService)

            scraper = scrapersService.scrapers[origin]

            await scraper.initialize()
        })

        describe('entryPoints', () => {
            it('should have unique entry points', () => {
                const identifiers = scraper.entryPoints.map((o) => o.identifier)
                expect(_.uniq(identifiers)).toEqual(identifiers)
            })
        })

        describe('#scrape', () => {
            let entryPoint: BaseEntryPoint

            beforeEach(async () => {
                entryPoint = _.sample(scraper.entryPoints)!
            })

            it('should return array of Listings', async () => {
                const page = 1
                const result = await entryPoint.scrape(page, {})

                expect(result.listings).toBeInstanceOf(Array)
                expect(result.listings.length).toBeGreaterThan(0)
                expect(typeof result.continue).toBe('boolean')
                expect(result.page).toBe(page)

                for (const listing of result.listings) {
                    validateListingTest(listing, entryPoint.createContext())
                }
            }, 10000)

            it('should error safely', async () => {
                const page = 999999
                const result = await entryPoint.scrape(page, {})

                // TraderaScraper returns a list of items even though the page
                // does not exist
                try {
                    expect(result.listings).toEqual([])
                } catch (e) {
                    for (const listing of result.listings) {
                        validateListingTest(listing, entryPoint.createContext())
                    }
                }

                expect(result.continue).toBe(false)
                expect(result.page).toBe(page)
            }, 10000)
        })
    })
})
