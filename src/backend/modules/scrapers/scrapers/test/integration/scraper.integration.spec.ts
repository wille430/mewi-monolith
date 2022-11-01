import _ from 'lodash'
import { ListingOrigin } from '@wille430/common'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { validateListingTest } from '../validate-listing.spec'
import { ScrapersService } from '../../../scrapers.service'
import { BaseListingScraper } from '../../../classes/BaseListingScraper'
import { BaseEntryPoint } from '../../../classes/BaseEntryPoint'

const testScrapers = Object.values(ListingOrigin).map((x) => [x])

describe('Scraper Integration', () => {
    describe.each(testScrapers)(`%s`, (origin) => {
        let scraper: BaseListingScraper

        beforeAll(async () => {
            const scrapersService = container.resolve(ScrapersService)
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
                entryPoint = _.sample(scraper.entryPoints) as BaseEntryPoint
            })

            it('should return array of Listings', async () => {
                const page = 1
                const result = await entryPoint.scrape(page, {})

                expect(result.listings).toBeInstanceOf(Array)
                expect(result.listings.length).toBeGreaterThanOrEqual(0)
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
