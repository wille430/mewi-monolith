import { Role } from '@/common/schemas'
import { Post, Put, Get, Body, Param, Delete, Query, HttpCode } from 'next-api-decorators'
import { inject } from 'tsyringe'
import { UpdateListingDto } from './dto/update-listing.dto'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { FindAllListingsDto } from './dto/find-all-listing.dto'
import { DeleteListingsDto } from './dto/delete-listings.dto'
import type { UserPayload } from '../common/types/UserPayload'
import type { ListingDocument } from '../schemas/listing.schema'
import { Roles } from '@/lib/middlewares/Roles'
import { Public } from '@/lib/decorators/public.decorator'
import { GetUser } from '@/lib/decorators/user.decorator'
import { Controller } from '@/lib/decorators/controller.decorator'
import { MyValidationPipe } from '@/lib/pipes/validation.pipe'

@Controller()
export class ListingsController {
    constructor(@inject(ListingsService) private readonly listingsService: ListingsService) {}

    @Post()
    @HttpCode(201)
    @Roles(Role.ADMIN)
    create(@Body(MyValidationPipe) createListingDto: CreateListingDto) {
        return this.listingsService.create(createListingDto)
    }

    @Get()
    @Public()
    findAll(@Query(MyValidationPipe) findAllListingsDto: FindAllListingsDto) {
        return this.listingsService.findAll(findAllListingsDto)
    }

    @Delete()
    @Roles(Role.ADMIN)
    deleteMany(@Body(MyValidationPipe) dto: DeleteListingsDto) {
        return this.listingsService.deleteMany(dto)
    }

    // TODO: CACHE?
    @Get('/featured')
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

    @Get('/autocomplete/:keyword')
    @Public()
    async autocomplete(@Param('keyword') keyword: string) {
        return this.listingsService.autocomplete(keyword)
    }

    @Get('/:id')
    @Public()
    findOne(@Param('id') id: string) {
        return this.listingsService.findOne(id)
    }

    @Put('/:id')
    @Roles(Role.ADMIN)
    update(@Param('id') id: string, @Body(MyValidationPipe) updateListingDto: UpdateListingDto) {
        return this.listingsService.update(id, updateListingDto)
    }

    @Delete('/:id')
    @Roles(Role.ADMIN)
    async remove(@Param('id') id: string) {
        await this.listingsService.remove(id)
        return 'OK'
    }

    @Put('/:id/like')
    @Roles(Role.USER)
    async likeOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        await this.listingsService.like(user.userId, id)
        return 'OK'
    }
    @Put('/:id/unlike')
    @Roles(Role.USER)
    async unlikeOne(@Param('id') id: string, @GetUser() user: UserPayload) {
        await this.listingsService.unlike(user.userId, id)
        return 'OK'
    }
}
