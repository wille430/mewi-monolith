import { Module, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Scrapers from './scrapers'
import { ScrapersController } from './scrapers.controller'
import { ScrapersService } from './scrapers.service'
import { UsersModule } from '@/users/users.module'
import { PrismaService } from '@/prisma/prisma.service'
import { ListingsModule } from '@/listings/listings.module'

@Module({
    imports: [ListingsModule, UsersModule],
    providers: [ScrapersService, ConfigService, PrismaService, ...Scrapers],
    controllers: [ScrapersController],
    exports: [ListingsModule],
})
export class ScrapersModule implements OnModuleInit {
    constructor(private scraperService: ScrapersService, private prisma: PrismaService) {}

    async onModuleInit() {
        this.scraperService.conditionalScrape()
    }
}
