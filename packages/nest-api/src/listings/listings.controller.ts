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
    UseGuards,
} from '@nestjs/common'
import { Cache } from 'cache-manager'
import { Role, Prisma } from '@mewi/prisma'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FindAllListingsDto } from '@/listings/dto/find-all-listing.dto'
import { Roles } from '@/auth/roles.decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { RolesGuard } from '@/auth/roles.guard'

@Controller('/listings')
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

    @Delete()
    @Roles(Role.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    deleteMany(@Body() dto: Prisma.ListingDeleteManyArgs) {
        return this.listingsService.deleteMany(dto)
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

    @Get('autocomplete/:keyword')
    async autocomplete(@Param('keyword') keyword: string) {
        return this.listingsService.autocomplete(keyword)
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id)
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
        return this.listingsService.update(id, updateListingDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.listingsService.remove(id)
    }
}
