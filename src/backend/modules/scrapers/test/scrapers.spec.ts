import faker from '@faker-js/faker'
import { Category, ScraperStatus, ScraperTrigger } from '@/common/schemas'
import 'reflect-metadata'
import { container } from 'tsyringe'
import crypto from 'crypto'
import type { BaseListingScraper } from '../classes/BaseListingScraper'
import Scrapers from '../scrapers'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import type { ShpockScraper } from '../scrapers/shpock.scraper'
import { ListingsRepository } from '../../listings/listings.repository'
import { listingStub } from '../../listings/test/stubs/listing.stub'
import { ScrapingLog } from '../../schemas/scraping-log.schema'

jest.mock('../../listings/listings.repository')
jest.mock('../scraping-logs.repository')
jest.mock('../classes/BaseEntryPoint')

describe('Scrapers', () => {
    describe.each(Scrapers.map((s) => [s.name, s]))('%s', (scraperName, Scraper) => {
        let listingsRepository: ListingsRepository
        let scrapingLogsRepository: ScrapingLogsRepository
        let scraper: BaseListingScraper

        beforeEach(async () => {
            listingsRepository = container.resolve(ListingsRepository)
            scrapingLogsRepository = container.resolve(ScrapingLogsRepository)
            scraper = container.resolve(Scraper as any)
            scraper.verbose = false

            jest.clearAllMocks()
        })

        describe('#initialize', () => {
            describe('when initialize is called', () => {
                beforeEach(async () => {
                    await scraper.initialize()
                })

                it('then it should set initialize to true', () => {
                    expect(scraper.initialized).toBe(true)
                })
            })
        })

        describe('#getConfig', () => {
            describe('when getConfig is called', () => {
                let limit: number | undefined

                beforeEach(async () => {
                    limit = scraper.config.limit
                })

                it('then it should return a number', () => {
                    expect(limit).toEqual(expect.any(Number))
                })
            })
        })

        describe('#start', () => {
            describe('when start is called', () => {
                beforeEach(async () => {
                    jest.spyOn(scraper, 'initialize')
                    jest.spyOn(scraper, 'deleteOldListings')
                    jest.spyOn(scraper, 'reset')
                    await scraper.start()
                })

                it('then initialize should be called', () => {
                    expect(scraper.initialize).toHaveBeenCalledTimes(1)
                })

                it('then entryPoint.getMostRecetLog should be called', () => {
                    expect(scraper.entryPoints[0].getMostRecentLog).toHaveBeenCalledTimes(
                        scraper.entryPoints.length
                    )
                })

                it('then entryPoint.scrape should be called', () => {
                    expect(scraper.entryPoints[0].scrape).toHaveBeenCalledTimes(
                        scraper.entryPoints.length
                    )

                    expect(scraper.entryPoints[0].scrape).toHaveBeenCalledWith(1, {
                        findIndex: expect.any(Function),
                        maxScrapeCount: expect.any(Number),
                    })
                })

                it('then listingsRepository.deleteMany should be called', () => {
                    expect(listingsRepository.deleteMany).toHaveBeenCalledWith({
                        origin_id: {
                            $in: [listingStub().origin_id],
                        },
                    })
                })

                it('then listingsRepository.createMany should be called', () => {
                    expect(listingsRepository.createMany).toHaveBeenCalledWith([
                        {
                            ...listingStub(),
                            entryPoint: scraper.entryPoints[0].identifier,
                        },
                    ])
                })

                it('then deleteOldListings should be called', () => {
                    expect(scraper.deleteOldListings).toHaveBeenCalledTimes(
                        scraper.entryPoints.length
                    )
                })

                it('then scrapingLogsRepository should be called', () => {
                    expect(scrapingLogsRepository.create).toHaveBeenNthCalledWith(
                        scraper.entryPoints.length,
                        expect.objectContaining({
                            error_count: 0,
                            added_count: 1,
                            entryPoint: scraper.entryPoints[0].identifier,
                            target: scraper.origin,
                            triggered_by: ScraperTrigger.Scheduled,
                        } as Partial<ScrapingLog>)
                    )
                })

                it('then reset should be called', () => {
                    expect(scraper.reset).toHaveBeenCalledTimes(1)
                })
            })
        })

        describe('#deleteOldListings', () => {
            describe('when deleteOldListings is called', () => {
                beforeEach(async () => {
                    await scraper.deleteOldListings()
                })

                it('then listingsRepository should be called', () => {
                    expect(listingsRepository.deleteMany).toHaveBeenCalledWith(
                        expect.objectContaining({
                            date: {
                                lte: new Date(scraper.config.deleteOlderThan),
                            },
                        })
                    )
                })
            })
        })

        describe('#createId', () => {
            describe('when createId is called', () => {
                let id: string

                beforeEach(() => {
                    jest.spyOn(crypto, 'createHash')

                    id = scraper.createId(faker.commerce.product())
                })

                it('then crypto should be called', () => {
                    expect(crypto.createHash).toHaveBeenCalledTimes(1)
                })

                it('then it should return prefixed id', () => {
                    expect(id).toMatch(new RegExp('^' + scraper.origin))
                })
            })
        })

        describe('#reset', () => {
            describe('when reset is called', () => {
                beforeEach(async () => {
                    ScraperStatus.SCRAPING
                    scraper.reset()
                })

                it('then status be IDLE', () => {
                    expect(scraper.status).toBe(ScraperStatus.IDLE)
                })
            })
        })

        describe('#parseCateogry', () => {
            describe('when parseCategory is called', () => {
                let retCategory: string

                beforeEach(async () => {
                    // This method on ShpockScraper calls an API.
                    // To prevent this, create a mocked function for all scrapers.
                    (scraper as ShpockScraper).originCategories = jest.fn()
                    jest.spyOn(scraper as ShpockScraper, 'originCategories').mockResolvedValue([])
                })

                describe('with no matching category', () => {
                    beforeEach(async () => {
                        retCategory = await scraper.parseCategory(faker.random.alphaNumeric(8))
                    })

                    it('then it should return ' + Category.OVRIGT, () => {
                        expect(retCategory).toBe(Category.OVRIGT)
                    })
                })

                describe('with matching category', () => {
                    let inputCategory: string

                    beforeEach(async () => {
                        inputCategory = faker.helpers.arrayElement(Object.values(Category))

                        retCategory = await scraper.parseCategory(inputCategory.toLowerCase())
                    })

                    it('then it should return category', () => {
                        expect(retCategory).toBe(inputCategory)
                    })
                })
            })
        })
    })
})
