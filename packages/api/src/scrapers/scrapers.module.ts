import { ListingsModule } from '@/listings/listings.module'
import { UsersModule } from '@/users/users.module'
import { Module, OnModuleInit } from '@nestjs/common'
import { ScrapersController } from './scrapers.controller'
import { ScrapersService } from './scrapers.service'

@Module({
    imports: [ListingsModule, ListingsModule, UsersModule],
    providers: [ScrapersService],
    controllers: [ScrapersController],
    exports: [ListingsModule],
})
export class ScrapersModule implements OnModuleInit {
    constructor(private scrapersService: ScrapersService) {}

    onModuleInit() {
        console.log('Initializing scraper module...')

        this.scrapersService.scheduleAll()
    }
}
