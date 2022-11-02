import type { ListingOrigin } from '@/common/schemas'
import { Role, ScraperTrigger } from '@/common/schemas'
import capitalize from 'lodash/capitalize'
import { Body, Get, Post, Put, Query, ValidationPipe } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { GetLogsDto } from './dto/get-logs.dto'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { StartScrapersDto } from './dto/start-scrapers.dto'
import { ScrapersService } from './scrapers.service'
import { Roles } from '@/backend/middlewares/Roles'
import { SessionGuard } from '@/backend/middlewares/SessionGuard'
import { AdminOrKeyGuard } from '@/backend/middlewares/admin-or-key.guard'
import { ScraperStatusReport } from '@/common/types'

@autoInjectable()
export class ScrapersController {
    constructor(@inject(ScrapersService) private readonly scrapersService: ScrapersService) {}

    @Post('/start')
    @AdminOrKeyGuard()
    async startAll(@Body(ValidationPipe) { scrapers }: StartScrapersDto) {
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
    start(@Query(ValidationPipe) startOneScraperDto: StartOneScraperDto) {
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
    async logs(@Body(ValidationPipe) dto: GetLogsDto) {
        return this.scrapersService.getLogs(dto)
    }

    @Put('/next')
    @AdminOrKeyGuard()
    scrapeNext() {
        return this.scrapersService.scrapeNext()
    }
}
