import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ListingOrigin, Category } from '@mewi/prisma'
import faker from '@faker-js/faker'
import { Scraper } from './scraper'
import configuration from '../config/configuration'
import { PrismaService } from '../prisma/prisma.service'

describe('scraper', () => {
    let prisma: PrismaService
    let configService: ConfigService
    let scraper: Scraper

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [ConfigModule.forRoot({ load: [configuration] })],
            providers: [ConfigService, PrismaService],
        }).compile()

        prisma = module.get<PrismaService>(PrismaService)
        configService = module.get<ConfigService>(ConfigService)
        scraper = new Scraper(prisma, configService, ListingOrigin.Blipp, faker.internet.url(), {})
    })

    describe('#parseCategory', () => {
        it('should return Fordon and save cache', () => {
            expect(scraper.parseCategory('frdon')).toEqual(Category.FORDON)
            expect(scraper['stringToCategoryMap']['frdon']).toEqual(Category.FORDON)
        })
    })
})
