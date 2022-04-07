import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { Role } from '@/auth/role.enum'
import { Roles } from '@/auth/roles.decorator'
import { RolesGuard } from '@/auth/roles.guard'
import { ListingOrigins } from '@wille430/common/types'
import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { StartOneScraperDto } from './dto/start-one-scraper.dto'
import { ScrapersService } from './scrapers.service'
import { capitalize } from 'lodash'

@Controller('scrapers')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScrapersController {
    constructor(private readonly scrapersService: ScrapersService) {}

    @Post('start')
    @Roles(Role.Admin)
    startAll() {
        return this.scrapersService.startAll()
    }

    @Post('start/:scraperName')
    @Roles(Role.Admin)
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
