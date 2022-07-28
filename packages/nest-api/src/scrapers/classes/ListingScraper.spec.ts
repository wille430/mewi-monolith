import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { ListingScraper, ScrapedListing } from './ListingScraper'
import { randomString } from '@wille430/common'

describe('Blipp Scraper', () => {
    let scraper: ListingScraper
    let prisma: PrismaService

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService, ListingScraper],
        }).compile()

        scraper = module.get<ListingScraper>(ListingScraper)
        prisma = module.get<PrismaService>(PrismaService)
    })

    it('should be defined', () => {
        expect(scraper).toBeDefined()
    })

    describe('#watch', () => {
        it('should scrape only newly added items', async () => {
            vi.useFakeTimers()
            scraper.watchDelay = () => Promise.resolve(10)

            const addedListings: ScrapedListing[] = []

            // Simulate scraping
            let i = -1
            let firstItemId = randomString(12)
            scraper.getBatch = vi.fn(() => {
                i += 1
                if (i === 0) {
                    return Promise.resolve({
                        listings: [{ origin_id: firstItemId }],
                    })
                } else {
                    firstItemId = randomString(12)
                    return Promise.resolve({
                        listings: [
                            {
                                origin_id: randomString(12),
                            },
                            {
                                origin_id: firstItemId,
                            },
                        ],
                    })
                }
            }) as any

            prisma.listing.createMany = vi.fn(({ data }) => {
                addedListings.push(...data)
            }) as any

            const ids = addedListings.map((x) => x.id)

            for (const id of ids) {
                expect(
                    ids.reduce((prev, cur) => {
                        if (cur === id) {
                            return prev + 1
                        } else {
                            return prev
                        }
                    }, 0)
                ).toBe(1)
            }

            const promise = scraper.watch()
            setTimeout(async () => {
                console.log('CANCELLING')
                ;(await promise).unsubscribe()
            }, 100)
        })

        it('should get batch until it finds old listings', async () => {})
    })
})
