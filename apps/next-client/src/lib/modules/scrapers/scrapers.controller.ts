import {Body, HttpCode, Post, Put} from 'next-api-decorators'
import { inject } from 'tsyringe'
import { GetLogsDto } from './dto/get-logs.dto'
import { ScrapersService } from './scrapers.service'
import { Roles } from '@/lib/middlewares/roles.guard'
import { AdminOrKeyGuard } from '@/lib/middlewares/admin-or-key.guard'
import { Controller } from '@/lib/decorators/controller.decorator'
import { MyValidationPipe } from '@/lib/pipes/validation.pipe'
import {Role} from "@mewi/models"

@Controller()
export class ScrapersController {
    constructor(@inject(ScrapersService) private readonly scrapersService: ScrapersService) {}

    @Post('/logs')
    @Roles(Role.ADMIN)
    async logs(@Body(MyValidationPipe) dto: GetLogsDto) {
        return this.scrapersService.getLogs(dto)
    }

    @Put('/next')
    @HttpCode(200)
    @AdminOrKeyGuard()
    async scrapeNext() {
        return this.scrapersService.scrapeNext()
    }
}
