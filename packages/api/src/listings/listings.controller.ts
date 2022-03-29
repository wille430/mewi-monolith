import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    CACHE_MANAGER,
    Inject,
    Query,
} from '@nestjs/common'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { Cache } from 'cache-manager'

@Controller('listings')
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) {}
    @Inject(CACHE_MANAGER) private cacheManager: Cache

    @Post()
    create(@Body() createListingDto: CreateListingDto) {
        return this.listingsService.create(createListingDto)
    }

    @Get()
    findAll(@Query() findAllListingsDto: FindAllListingsDto) {
        return this.listingsService.findAll(findAllListingsDto)
    }

    @Get('featured')
    async featured() {
        if (!(await this.cacheManager.get('featured'))) {
            console.log('Caching random listings...')
            this.cacheManager.set('featured', await this.listingsService.sample(5), {
                ttl: 60 * 60,
            })
        }

        return await this.cacheManager.get('featured')
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(+id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
        return this.listingsService.update(+id, updateListingDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.listingsService.remove(+id)
    }
}
