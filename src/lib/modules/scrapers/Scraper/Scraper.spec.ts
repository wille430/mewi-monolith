import { validateListingTest } from '../scrapers/test/validate-listing'
import { Scraper } from './Scraper'
import { BlocketEndpoint } from './Blocket/BlocketEndpoint'
import { BytbilEndPoint } from './Bytbil/BytbilEndPoint'
import { AbstractEndPoint } from './EndPoint'
import { BlippEndPoint } from './Blipp/BlippEndPoint'
import { BlocketScraper } from './Blocket/BlocketScraper'
import { BilwebEndpoint } from './Bilweb/BilwebEndpoint'
import { CitiboardEndPoint } from './Citiboard/CitiboardEndPoint'
import { KvdBilEndPoint } from './KvdBil/KvdBilEndPoint'
import { SellpyEndPoint } from './Sellpy/SellpyEndPoint'
import { ShpockEndPoint } from './Shpock/ShpockEndPoint'
import { TraderaEndPoint } from './Tradera/TraderaEndPoint'

describe('Scraper', () => {
    describe('BlocketScraper', () => {
        let scraper: Scraper<any>

        beforeAll(() => {
            scraper = new BlocketScraper()
        })

        describe('#scrape', () => {
            describe('without config', () => {
                it('should return listings', async () => {
                    const scrapeAmount = 10
                    const { entities: listings, metadata } = await scraper.endPoints[0].scrape(
                        {
                            limit: scrapeAmount,
                            skip: 0,
                        },
                        {
                            scrapeAmount,
                        }
                    )

                    expect(Array.isArray(listings)).toBe(true)
                    expect(listings.length).toBe(scrapeAmount)

                    expect(metadata.totalPages).toBeGreaterThan(0)

                    for (const listing of listings) {
                        validateListingTest(listing)
                    }
                }, 99999)
            })
        })
    })
})

describe('EndPoint', () => {
    describe.each([
        new BlocketEndpoint(),
        new BytbilEndPoint('moped'),
        new BlippEndPoint(),
        new BilwebEndpoint(),
        new CitiboardEndPoint(),
        new KvdBilEndPoint(),
        new SellpyEndPoint(),
        new ShpockEndPoint(),
        new TraderaEndPoint('/category/1612'),
    ])('%s', (endPoint: AbstractEndPoint<any>) => {
        describe('#scrape', () => {
            let res: Awaited<ReturnType<typeof endPoint['scrape']>>
            const scrapeAmount = 10

            beforeAll(async () => {
                res = await endPoint.scrape(
                    {
                        limit: scrapeAmount,
                        skip: 0,
                    },
                    {
                        scrapeAmount: scrapeAmount,
                    }
                )
            }, 99999)

            it('should return listings', async () => {
                const { entities } = res

                expect(entities).toBeInstanceOf(Array)
                expect(entities.length).toBeGreaterThan(0)

                for (const listing of entities) {
                    validateListingTest(listing)
                }
            })

            it('should return metadata', async () => {
                const { metadata } = res

                expect(metadata).toBeInstanceOf(Object)
            })
        })
    })
})
