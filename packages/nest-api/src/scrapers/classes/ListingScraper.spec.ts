import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PrismaService } from '../../prisma/prisma.service'
import configuration from '../../config/configuration'
import { ListingScraper } from './ListingScraper'
import { randomString } from '@wille430/common'
import { random } from 'lodash'

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
        // it('should run until #cancelWatch is called', async () => {
        //     const promise = scraper.watch()
        //     scraper.getBatch = vi.fn().mockResolvedValue(Array(scraper.limit).fill({}))
        //     vi.useFakeTimers()

        //     await new Promise<void>((resolve) => {
        //         setTimeout(resolve, 500)
        //     })

        //     scraper.cancelWatch()
        //     console.log('CANCELED')

        //     await new Promise<void>((resolve) => {
        //         setTimeout(resolve, 5000)
        //     })
        //     expect(await promise).not.toBeInstanceOf(Promise)
        // }, 20000)

        it('should scrape only newly added items', async () => {
            vi.useFakeTimers()
            scraper.watchDelay = () => 10

            // Simulate scraping
            let i = -1
            let firstItemId = randomString(12)
            scraper.getBatch = vi.fn(() => {
                i += 1
                if (i === 0) {
                    return Promise.resolve([{ origin_id: firstItemId }])
                } else {
                    firstItemId = randomString(12)
                    return Promise.resolve([
                        {
                            origin_id: randomString(12),
                        },
                        {
                            origin_id: firstItemId,
                        },
                    ])
                }
            }) as any

            prisma.listing.createMany = vi.fn(({ data }) => {
                expect(data.length).toBe(2)
            }) as any

            scraper.watch()
            setTimeout(() => {
                console.log('CANCELLING')
                scraper.cancelWatch()
            }, 100)
        })
    })
})
