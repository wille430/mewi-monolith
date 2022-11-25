import { faker } from '@faker-js/faker'
import { ListingOrigin } from '@/common/schemas'
import 'reflect-metadata'
import { container } from 'tsyringe'
import { scrapingLogStub } from './stubs/scraping-log.stub'
import { ScrapersService } from '../scrapers.service'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '../../listings/listings.repository'
import { ScrapingLog } from '../../schemas/scraping-log.schema'
import { Listing } from '../../schemas/listing.schema'
import { AbstractEndPoint } from '../Scraper/EndPoint'

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

    describe('#scrapeNext', () => {
        describe('when scrapeNext is called', () => {
            let endPoint: AbstractEndPoint<Listing>

            beforeEach(async () => {
                const start = faker.datatype.number({
                    min: 0,
                    max: scrapersService.endPoints.length,
                })
                endPoint = scrapersService.endPoints[start]
                jest.spyOn(scrapersService, 'getNextEndPoint').mockResolvedValue(endPoint)
                await scrapersService.scrapeNext()
            })

            it('then getNextEndPoint should have been called', () => {
                expect(scrapersService.getNextEndPoint).toHaveBeenCalledWith()
            })

            it('then listingsRepository should have been called', () => {
                expect(listingsRepository.createMany).toHaveBeenCalledWith(expect.any(Array))
            })
        })
    })

    describe('#getNextEndPoint', () => {
        describe('when getNextEndPoint is called', () => {
            let endpoint: AbstractEndPoint<Listing> | undefined
            let startEndpoint: AbstractEndPoint<Listing>

            beforeEach(async () => {
                startEndpoint = faker.helpers.arrayElement(scrapersService.endPoints)
                scrapingLogsRepository.findOne = jest.fn().mockResolvedValue({
                    entryPoint: startEndpoint.getIdentifier(),
                })

                endpoint = await scrapersService.getNextEndPoint()
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

            it('should then return next endpoint', () => {
                expect(endpoint).toBeInstanceOf(AbstractEndPoint)

                const index = scrapersService.endPoints.findIndex((o) => o == endpoint)
                expect(
                    scrapersService.endPoints.findIndex((o) => o == startEndpoint) +
                        (1 % scrapersService.endPoints.length)
                ).toBe(index)
            })
        })
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
})
