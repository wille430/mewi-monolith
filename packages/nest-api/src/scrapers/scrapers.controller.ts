import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { ListingOrigin, Role } from '@wille430/common'
import { Roles } from '@/auth/roles.decorator'
import { RolesGuard } from '@/auth/roles.guard'
import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { ScrapersService } from './scrapers.service'
import { capitalize } from 'lodash'

@Controller('/scrapers')
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
            capitalize(startOneScraperDto.scraperName) as ListingOrigin
        )

        if (!started) {
            return `No scraper named ${startOneScraperDto.scraperName}`
        } else {
            return `Initializing ${startOneScraperDto.scraperName}-scraper`
        }
    }
}
