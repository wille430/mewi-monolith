import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Role } from '@prisma/client'
import { Roles } from '@/auth/roles.decorator'
import { RolesGuard } from '@/auth/roles.guard'
import { ListingOrigins } from '@wille430/common'
import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { ScrapersService } from './scrapers.service'
import { capitalize } from 'lodash'

@Controller('/api/scrapers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScrapersController {
    constructor(private readonly scrapersService: ScrapersService) {}

    @Post('start')
    @Roles(Role.ADMIN)
    startAll() {
        return this.scrapersService.startAll()
    }

    @Post('start/:scraperName')
    @Roles(Role.ADMIN)
    start(@Param() startOneScraperDto: StartOneScraperDto) {
        const started = this.scrapersService.start(
            capitalize(startOneScraperDto.scraperName) as ListingOrigins
        )

        if (!started) {
            return `No scraper named ${startOneScraperDto.scraperName}`
        } else {
            return `Initializing ${startOneScraperDto.scraperName}-scraper`
        }
    }
}
