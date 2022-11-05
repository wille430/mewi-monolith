import { faker } from '@faker-js/faker'
import { ListingOrigin } from '@/common/schemas'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { scraperStatusReportStub } from './stubs/scraper-status-report.stub'
import { scrapingLogStub } from './stubs/scraping-log.stub'
import type { BaseListingScraper } from '../classes/BaseListingScraper'
import { ScrapersService } from '../scrapers.service'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '../../listings/listings.repository'
import { listingStub } from '../../listings/test/stubs/listing.stub'
import { ScrapingLog, ScrapingLogDocument } from '../../schemas/scraping-log.schema'
import { ScraperStatus } from '@/common/types'

jest.mock('../scraping-logs.repository')
jest.mock('../../listings/listings.repository')
jest.mock('../classes/ListingScraper')
jest.mock('../classes/ListingWebCrawler')

jest.mock('../scrapers/tradera.scraper')
jest.mock('../scrapers/shpock.scraper')

describe('ScrapersService', () => {
    let scrapingLogsRepository: ScrapingLogsRepository
    let listingsRepository: ListingsRepository
    let scrapersService: ScrapersService

    beforeEach(async () => {
        scrapingLogsRepository = container.resolve(ScrapingLogsRepository)
        listingsRepository = container.resolve(ListingsRepository)
        scrapersService = container.resolve(ScrapersService)

        jest.clearAllMocks()
        jest.restoreAllMocks()
    })

    describe('#instantiateScrapers', () => {
        describe('when instantiateScrapers is called', () => {
            beforeEach(() => {
                scrapersService.instantiateScrapers()
            })

            it('then it should update scrapers property', () => {
                expect(scrapersService.scrapers).toMatchObject(
                    Object.values(ListingOrigin).reduce((prev, curr) => {
                        prev[curr] = expect.anything()
                        return prev
                    }, {} as any)
                )
            })
        })
    })

    describe('#logPipeline', () => {
        describe('when logPipeline is called', () => {
            let total: number
            let msg: string
            beforeEach(() => {
                jest.spyOn(console, 'log')

                total = 1
                msg = 'test'

                scrapersService.logPipeline(total, msg)
            })

            it('then console.log should be called', () => {
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining(total.toString()))
                expect(console.log).toHaveBeenCalledWith(expect.stringContaining(msg))
            })
        })
    })

    // describe('#handlePipelineRunEvent', () => {
    //     describe('when handlePipelineRunEvent is called', () => {
    //         beforeEach(async () => {
    //             await scrapersService.handlePipelineRunEvent(runPipelineEventStub())
    //         })
    //     })
    // })

    // TODO
    // describe('#startAll', () => {
    //     describe('when startAll is called', () => {
    //         beforeEach(async () => {
    //             jest.spyOn(eventEmitter, 'emit')

    //             await scrapersService.startAll()
    //         })

    //         it('then eventEmitter should be called', () => {
    //             expect(eventEmitter.emit).toHaveBeenCalledWith(
    //                 'pipeline.run',
    //                 expect.any(RunPipelineEvent)
    //             )
    //         })
    //     })
    // })

    describe('#start', () => {
        describe('when start is called', () => {
            describe('with valid scraper name', () => {
                beforeEach(async () => {
                    // jest.spyOn(eventEmitter, 'emit')

                    await scrapersService.start(listingStub().origin)
                })

                it('then scraperPipeline should be updated', () => {
                    expect(scrapersService.scraperPipeline).toMatchObject([
                        [listingStub().origin, expect.anything()],
                    ])
                })

                // it('then eventEmitter should be called', () => {
                //     expect(eventEmitter.emit).toHaveBeenCalledWith(
                //         'pipeline.run',
                //         expect.any(RunPipelineEvent)
                //     )
                // })
            })

            describe('with invalid scraper name', () => {
                it('then it should throw', () => {
                    expect(scrapersService.start(faker.random.word() as any)).rejects.toThrow()
                })
            })
        })
    })

    describe('#scrapeNext', () => {
        describe('when scrapeNext is called', () => {
            let index0: number
            let scraper: BaseListingScraper

            beforeEach(async () => {
                index0 = faker.datatype.number({
                    min: 0,
                    max: Object.keys(scrapersService.scrapers).length - 1,
                })
                scraper =
                    scrapersService.scrapers[
                        Object.keys(scrapersService.scrapers)[index0] as ListingOrigin
                    ]
                scraper.status = ScraperStatus.IDLE
                jest.spyOn(scrapersService, 'getLastScrapedIndex').mockResolvedValue(index0)
                await scrapersService.scrapeNext()
            })

            it('then getLastScrapedIndex should have been called', () => {
                expect(scrapersService.getLastScrapedIndex).toHaveBeenCalledWith()
            })

            it('then scraperIndex should increment', () => {
                expect(scrapersService.scraperIndex).toBe(
                    (index0 + 1) % Object.keys(scrapersService.scrapers).length
                )
            })

            it('then start should have been called on scraper', () => {
                expect(scraper.start).toHaveBeenCalledWith()
            })
        })
    })

    describe('#getLastScrapedIndex', () => {
        describe('when getLastScrapedIndex is called', () => {
            let index: number

            beforeEach(async () => {
                index = await scrapersService.getLastScrapedIndex()
            })

            it('then scrapingLogsRepository should be called', () => {
                expect(scrapingLogsRepository.findOne).toHaveBeenCalledWith(
                    {},
                    {
                        sort: {
                            createdAt: -1,
                        },
                    }
                )
            })

            it('should then return a number', () => {
                expect(index).toEqual(expect.any(Number))
                expect(index).toBeGreaterThanOrEqual(0)
                expect(index).toBeLessThan(Object.keys(scrapersService.scrapers).length)
            })
        })
    })

    describe('#conditionalScrape', () => {
        describe('when conditionalScrape is called', () => {
            describe('and last created scrapingLog is recent', () => {
                beforeEach(async () => {
                    jest.spyOn(scrapersService, 'startAll')

                    await scrapersService.conditionalScrape()
                })

                it('then scrapingLogsRepository should be called', () => {
                    expect(scrapingLogsRepository.findOne).toHaveBeenCalled()
                })

                it('then startAll should not be called', () => {
                    expect(scrapersService.startAll).not.toHaveBeenCalled()
                })
            })

            describe('and no recent scrapingLog exists', () => {
                let createdAt: Date

                beforeEach(async () => {
                    jest.spyOn(scrapersService, 'startAll').mockResolvedValue()

                    createdAt = faker.date.past(0.5)
                    jest.spyOn(scrapingLogsRepository, 'findOne').mockResolvedValue({
                        ...scrapingLogStub(),
                        createdAt: createdAt,
                        updatedAt: createdAt,
                    } as ScrapingLogDocument)

                    await scrapersService.conditionalScrape()
                })

                afterEach(() => {
                    jest.mock('../scraping-logs.repository')
                })

                it('then scrapingLogsRepository should be called', () => {
                    expect(scrapingLogsRepository.findOne).toHaveBeenCalled()
                })

                it('then startAll should be called', () => {
                    expect(scrapersService.startAll).toHaveBeenCalled()
                })
            })
        })
    })

    describe('#status', () => {
        describe('when status is called', () => {
            let obj: any

            beforeEach(async () => {
                jest.spyOn(scrapersService, 'statusOf').mockResolvedValue(scraperStatusReportStub())
                obj = await scrapersService.status()
            })

            it('then statusOf should have been called n times', () => {
                expect(scrapersService.statusOf).toHaveBeenCalledTimes(
                    Object.keys(scrapersService.scrapers).length
                )
            })

            it('then it should return object', () => {
                Object.values(obj).forEach((o) =>
                    expect(o).toMatchObject(scraperStatusReportStub())
                )
            })
        })
    })

    describe('#statusOf', () => {
        describe.each(Object.values(ListingOrigin))(
            'when statusOf is called with %s',
            (target: ListingOrigin) => {
                let obj: any

                beforeEach(async () => {
                    jest.spyOn(scrapingLogsRepository, 'findOne').mockResolvedValue(
                        scrapingLogStub() as ScrapingLogDocument
                    )
                    obj = await scrapersService.statusOf(target)
                })

                it('then listingsRepository should be called', () => {
                    expect(listingsRepository.count).toHaveBeenCalledTimes(1)
                    expect(listingsRepository.count).toHaveBeenCalledWith({
                        origin: target,
                    })
                })

                it('then it should return object', () => {
                    expect(obj).toMatchObject({
                        ...scraperStatusReportStub(),
                        status: expect.any(String),
                    })
                })
            }
        )
    })

    describe('#getLogs', () => {
        describe('when getLogs is called', () => {
            let scrapingLogs: ScrapingLog[] | null
            beforeEach(async () => {
                scrapingLogs = await scrapersService.getLogs({})
            })

            it('then scrapingLogsRepository should be called', () => {
                expect(scrapingLogsRepository.find).toHaveBeenCalledWith({})
            })

            it('should return listings', () => {
                expect(scrapingLogs).toMatchObject([scrapingLogStub()])
            })
        })
    })

    describe('#resetAll', () => {
        describe('when resetAll is called', () => {
            beforeEach(async () => {
                await scrapersService.resetAll()
            })

            it('then reset should be called on each scraper', () => {
                expect(
                    faker.helpers.arrayElement(Object.values(scrapersService.scrapers)).reset
                ).toHaveBeenCalled()
            })
        })
    })
})
