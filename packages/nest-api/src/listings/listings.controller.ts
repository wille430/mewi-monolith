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
    Put,
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
import { Public } from '@/common/decorators/public.decorator'
import { GetUser } from '@/common/decorators/user.decorator'
import { UserPayload } from '@/auth/jwt-strategy'

@Controller('/listings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ListingsController {
    constructor(private readonly listingsService: ListingsService) {}
    @Inject(CACHE_MANAGER) private cacheManager: Cache

    @Post()
    @Roles(Role.ADMIN)
    create(@Body() createListingDto: CreateListingDto) {
        return this.listingsService.create(createListingDto)
    }

    @Get()
    @Public()
    findAll(@Query() findAllListingsDto: FindAllListingsDto) {
        return this.listingsService.findAll(findAllListingsDto)
    }

    @Delete()
    @Roles(Role.ADMIN)
    deleteMany(@Body() dto: Prisma.ListingDeleteManyArgs) {
        return this.listingsService.deleteMany(dto)
    }

    @Get('featured')
    @Public()
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
    @Public()
    async autocomplete(@Param('keyword') keyword: string) {
        return this.listingsService.autocomplete(keyword)
    }

    @Get(':id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id)
    }

    @Patch(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body() updateListingDto: UpdateListingDto) {
        return this.listingsService.update(id, updateListingDto)
    }

    @Delete(':id')
    @Roles(Role.ADMIN)
    remove(@Param('id') id: string) {
        return this.listingsService.remove(id)
    }

    @Put(':id/like')
    @Roles(Role.USER)
    likeOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.listingsService.like(user.userId, id)
    }
    @Put(':id/unlike')
    @Roles(Role.USER)
    unlikeOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        return this.listingsService.unlike(user.userId, id)
    }
}
