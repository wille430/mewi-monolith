import { ListingOrigin, Role } from '@mewi/prisma'
import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common'
import { capitalize } from 'lodash'
import { ApiOperation, ApiTags } from '@nestjs/swagger'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { ScrapersService } from './scrapers.service'
import { StartScrapersDto } from './dto/start-scrapers.dto'
import { RolesGuard } from '@/auth/roles.guard'
import { Roles } from '@/auth/roles.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'

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
            const startStatusMap: Partial<Record<ListingOrigin, boolean>> = {}

            for (const scraper of scrapers) {
                startStatusMap[scraper] = this.scrapersService.start(scraper)
            }

            return {
                scraper_status: startStatusMap,
            }
        } else {
            return this.scrapersService.startAll()
        }
    }

    @Post('start/:scraperName')
    @Roles(Role.ADMIN)
    @ApiTags('scrapers')
    start(@Param() startOneScraperDto: StartOneScraperDto) {
        const started = this.scrapersService.start(
            capitalize(startOneScraperDto.scraperName) as ListingOrigin
        )

        if (!started) {
            return `No scraper named ${startOneScraperDto.scraperName}`
        } else {
            return `Initializing ${startOneScraperDto.scraperName}-scraper`
        }
    }
}
