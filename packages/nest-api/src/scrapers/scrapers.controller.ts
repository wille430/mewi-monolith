import { ListingOrigin, Role, Prisma, ScraperTrigger } from '@mewi/prisma'
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { capitalize } from 'lodash'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { ScraperStatusReport } from '@wille430/common'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { ScrapersService } from './scrapers.service'
import { StartScrapersDto } from './dto/start-scrapers.dto'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/roles.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { GetLogsDto } from './dto/get-logs.dto'

@Controller('/scrapers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScrapersController {
    constructor(private readonly scrapersService: ScrapersService) {}

    @Post('start')
    @Roles(Role.ADMIN)
    @ApiTags('scrapers')
    @ApiOperation({
        summary: 'Starts all, or specific scrapers',
    })
    async startAll(@Body() { scrapers }: StartScrapersDto) {
        if (scrapers) {
            const startStatusMap: Partial<Record<ListingOrigin, ScraperStatusReport>> = {}

            for (const scraper of scrapers) {
                startStatusMap[scraper] = await this.scrapersService.start(scraper, {
                    triggeredBy: ScraperTrigger.Manual,
                })
            }

            return {
                scraper_status: startStatusMap,
            }
        } else {
            return this.scrapersService.startAll({ triggeredBy: ScraperTrigger.Manual })
        }
    }

    @Post('start/:scraperName')
    @Roles(Role.ADMIN)
    @ApiTags('scrapers')
    start(@Param() startOneScraperDto: StartOneScraperDto) {
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

    @Get('status')
    @Roles(Role.ADMIN)
    async status() {
        return this.scrapersService.status()
    }

    @Post('logs')
    @Roles(Role.ADMIN)
    async logs(@Body() dto: GetLogsDto) {
        return this.scrapersService.getLogs(dto)
    }
}
