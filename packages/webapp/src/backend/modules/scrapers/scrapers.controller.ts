import type { ListingOrigin, ScraperStatusReport } from '@wille430/common'
import { Role, ScraperTrigger } from '@wille430/common'
import capitalize from 'lodash/capitalize'
import { Body, Get, Post, Query, ValidationPipe } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import type { GetLogsDto } from './dto/get-logs.dto'
import type { StartOneScraperDto } from './dto/start-one-scraper.dto'
import type { StartScrapersDto } from './dto/start-scrapers.dto'
import { ScrapersService } from './scrapers.service'
import { Roles } from '@/backend/middlewares/Roles'
import { SessionGuard } from '@/backend/middlewares/SessionGuard'

@autoInjectable()
@SessionGuard()
export class ScrapersController {
    constructor(@inject(ScrapersService) private readonly scrapersService: ScrapersService) {}

    @Post('/start')
    @Roles(Role.ADMIN)
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
    @Roles(Role.ADMIN)
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
}
