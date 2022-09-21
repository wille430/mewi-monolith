import { PrismaService } from '@/prisma/prisma.service'
import { ConfigService } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import _ from 'lodash'
import { BaseEntryPoint } from '../classes/BaseEntryPoint'
import { BaseListingScraper } from '../classes/BaseListingScraper'
import { validateListingTest } from '../tests/validate-listing.spec'

export const commonScraperTests = <T extends typeof BaseListingScraper>(
    ScraperProvider: T | any
) => {
    describe(`Common tests for ${ScraperProvider.name} implementation`, () => {
        let prisma: PrismaService
        let scraper: InstanceType<T>

        beforeEach(async () => {
            const module: TestingModule = await Test.createTestingModule({
                providers: [PrismaService, ScraperProvider as any, ConfigService],
            }).compile()

            prisma = module.get<PrismaService>(PrismaService)
            scraper = module.get(ScraperProvider as any)
            scraper.verbose = true
        })

        it('should have unique entry points', () => {
            const identifiers = scraper.entryPoints.map((o) => o.identifier)
            expect(_.uniq(identifiers)).toEqual(identifiers)
        })

        describe('#scrape', () => {
            let entryPoint: BaseEntryPoint

            beforeEach(async () => {
                await scraper.initialize()
                entryPoint = _.sample(scraper.entryPoints)!
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

            it('should error safely', async () => {
                const page = 999999
                const result = await entryPoint.scrape(page, {})

                expect(result.listings).toEqual([])
                expect(result.continue).toBe(false)
                expect(result.page).toBe(page)
            }, 20000)
        })
    })
}

describe('Common tests for scraper instances', () => {
    it('should be used per scraper', () => {})
})
