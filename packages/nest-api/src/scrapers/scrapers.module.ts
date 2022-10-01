import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScrapersController } from './scrapers.controller'
import { ScrapersService } from './scrapers.service'
import { UsersModule } from '@/users/users.module'
import { ListingsModule } from '@/listings/listings.module'
import { ScrapingLogsRepository } from './scraping-logs.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { ScrapingLog, ScrapingLogSchema } from '@/schemas/scraping-log.schema'

@Module({
    imports: [
        ListingsModule,
        UsersModule,
        MongooseModule.forFeature([
            {
                name: ScrapingLog.name,
                schema: ScrapingLogSchema,
            },
        ]),
    ],
    providers: [ScrapersService, ConfigService, ScrapingLogsRepository],
    controllers: [ScrapersController],
    exports: [ListingsModule, MongooseModule],
})
export class ScrapersModule implements OnModuleInit {
    constructor(private scraperService: ScrapersService) {}

    async onModuleInit() {
        this.scraperService.conditionalScrape()
    }
}
