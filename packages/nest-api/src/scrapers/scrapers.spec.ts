import Scrapers from './scrapers'
import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import _ from 'lodash'
import { BaseEntryPoint } from './classes/BaseEntryPoint'
import { validateListingTest } from './tests/validate-listing.spec'
import { BaseListingScraper } from './classes/BaseListingScraper'

const testScrapers = Scrapers.map((x) => [x.name, x])

describe.each(testScrapers)(`Common scraper test (%s)`, (a, ScraperProvider) => {
    let prisma: PrismaService
    let scraper: BaseListingScraper

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService, ScraperProvider as any, ConfigService],
        })
            .overrideProvider(PrismaService)
            .useValue({})
            .compile()

        prisma = module.get<PrismaService>(PrismaService)
        scraper = module.get(ScraperProvider as any)
        scraper.verbose = true

        await scraper.initialize()
    })

    it('should have unique entry points', () => {
        const identifiers = scraper.entryPoints.map((o) => o.identifier)
        expect(_.uniq(identifiers)).toEqual(identifiers)
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
            expect(typeof result.continue).toBe('boolean')
            expect(result.page).toBe(page)

            for (const listing of result.listings) {
                validateListingTest(listing, entryPoint.createContext())
            }
        }, 20000)

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
        }, 20000)
    })
})
