import { Role } from '@wille430/common'
import { Post, Put, Get, Body, ValidationPipe, Param, Delete, Query } from 'next-api-decorators'
import { autoInjectable, inject } from 'tsyringe'
import { UpdateListingDto } from './dto/update-listing.dto'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { FindAllListingsDto } from './dto/find-all-listing.dto'
import { DeleteListingsDto } from './dto/delete-listings.dto'
import { Public } from '../common/decorators/public.decorator'
import { GetUser } from '../common/decorators/user.decorator'
import type { UserPayload } from '../common/types/UserPayload'
import type { ListingDocument } from '../schemas/listing.schema'
import { Roles } from '@/backend/middlewares/Roles'
import { SessionGuard } from '@/backend/middlewares/SessionGuard'

@autoInjectable()
@SessionGuard()
export class ListingsController {
    constructor(@inject(ListingsService) private readonly listingsService: ListingsService) {}

    @Post()
    @Roles(Role.ADMIN)
    create(@Body(ValidationPipe) createListingDto: CreateListingDto) {
        return this.listingsService.create(createListingDto)
    }

    @Get()
    @Public()
    findAll(@Query(ValidationPipe) findAllListingsDto: FindAllListingsDto) {
        return this.listingsService.findAll(findAllListingsDto)
    }

    @Delete()
    @Roles(Role.ADMIN)
    deleteMany(@Body(ValidationPipe) dto: DeleteListingsDto) {
        return this.listingsService.deleteMany(dto)
    }

    // TODO: CACHE?
    @Get('featured')
    @Public()
    async featured() {
        // let cachedListings: IListing[] | undefined = await this.cacheManager.get('featured')
        let cachedListings: ListingDocument[] | undefined = undefined
        if (!cachedListings) {
            cachedListings = await this.listingsService.sample(5)
            // await this.cacheManager.set('featured', cachedListings, {
            //     ttl: 60 * 60,
            // })
        }

        return cachedListings
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

    @Put(':id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body(ValidationPipe) updateListingDto: UpdateListingDto) {
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
