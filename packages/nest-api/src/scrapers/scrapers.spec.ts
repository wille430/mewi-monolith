import { PrismaService } from '@/prisma/prisma.service'
import { Test, TestingModule } from '@nestjs/testing'
import _ from 'lodash'
import { BaseEntryPoint } from './classes/BaseEntryPoint'
import { BaseListingScraper } from './classes/BaseListingScraper'
import Scrapers from './scrapers'
import { validateListingTest } from './tests/validate-listing.spec'

describe.each((Scrapers as any[]).map((o) => [o.name, o]))('%s', (name, Scraper) => {
    let prisma: PrismaService
    let scraper: BaseListingScraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PrismaService, Scraper],
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        scraper = module.get<typeof Scraper>(Scraper)
        scraper.verbose = true
    })

    describe('#scrape', () => {
        let entryPoint: BaseEntryPoint

        beforeEach(async () => {
            await scraper.initialize()
            entryPoint = _.sample(scraper.entryPoints)
        })

        it('should return array of Listings', async () => {
            const page = 1
            const result = await entryPoint.scrape(page, {})

            expect(result.listings).instanceOf(Array)
            expect(typeof result.continue).toBe('boolean')
            expect(result.page).toBe(page)

            for (const listing of result.listings) {
                validateListingTest(listing, entryPoint.createContext())
            }
        }, 20000)
    })
})
