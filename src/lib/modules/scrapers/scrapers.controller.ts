import type { ListingOrigin } from '@/common/schemas'
import { Role, ScraperTrigger } from '@/common/schemas'
import capitalize from 'lodash/capitalize'
import { Body, Get, Post, Put, Query } from 'next-api-decorators'
import { inject } from 'tsyringe'
import { GetLogsDto } from './dto/get-logs.dto'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { StartScrapersDto } from './dto/start-scrapers.dto'
import { ScrapersService } from './scrapers.service'
import { Roles } from '@/lib/middlewares/Roles'
import { ScraperStatusReport } from '@/common/types'
import { AdminOrKeyGuard } from '@/lib/middlewares/admin-or-key.guard'
import { Controller } from '@/lib/decorators/controller.decorator'
import { MyValidationPipe } from '@/lib/pipes/validation.pipe'

@Controller()
export class ScrapersController {
    constructor(@inject(ScrapersService) private readonly scrapersService: ScrapersService) {}

    @Post('/start')
    @AdminOrKeyGuard()
    async startAll(@Body(MyValidationPipe) { scrapers }: StartScrapersDto) {
        if (scrapers) {
            const startStatusMap: Partial<Record<ListingOrigin, ScraperStatusReport>> = {}

            for (const scraper of scrapers) {
                startStatusMap[scraper as ListingOrigin] = await this.scrapersService.start(
                    scraper,
                    {
                        triggeredBy: ScraperTrigger.Manual,
                    }
                )
            }

            return {
                scraper_status: startStatusMap,
            }
        } else {
            return this.scrapersService.startAll({ triggeredBy: ScraperTrigger.Manual })
        }
    }

    @Post('/start/:scraperName')
    @AdminOrKeyGuard()
    start(@Query(MyValidationPipe) startOneScraperDto: StartOneScraperDto) {
        const started = this.scrapersService.start(
            capitalize(startOneScraperDto.scraperName) as ListingOrigin,
            { triggeredBy: ScraperTrigger.Manual }
        )

        if (!started) {
            return `No scraper named ${startOneScraperDto.scraperName}`
        } else {
            return `Initializing ${startOneScraperDto.scraperName}-scraper`
        }
    }

    @Get('/status')
    @Roles(Role.ADMIN)
    async status() {
        return this.scrapersService.status()
    }

    @Post('/logs')
    @Roles(Role.ADMIN)
    async logs(@Body(MyValidationPipe) dto: GetLogsDto) {
        return this.scrapersService.getLogs(dto)
    }

    @Put('/next')
    @AdminOrKeyGuard()
    scrapeNext() {
        return this.scrapersService.scrapeNext()
    }
}
