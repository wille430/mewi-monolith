import {HttpCode, Put} from "next-api-decorators";
import {inject} from "tsyringe";
import {ScrapersService} from "./scrapers.service";
import {AdminOrKeyGuard} from "@/lib/middlewares/admin-or-key.guard";
import {Controller} from "@/lib/decorators/controller.decorator";

@Controller()
export class ScrapersController {
    constructor(@inject(ScrapersService) private readonly scrapersService: ScrapersService) {
    }

    @Put("/next")
    @HttpCode(200)
    @AdminOrKeyGuard()
    async scrapeNext() {
        return this.scrapersService.scrapeNext();
    }
}
