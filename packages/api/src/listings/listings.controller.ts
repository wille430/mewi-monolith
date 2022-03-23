import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { CreateListingDto } from './dto/create-listing.dto'
import { UpdateListingDto } from './dto/update-listing.dto'
import { FindAllListingsDto } from 'listings/dto/find-all-listing.dto'

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Post()
  create(@Body() createListingDto: CreateListingDto) {
    return this.listingsService.create(createListingDto)
  }

  @Post('/search')
  findAll(@Body() findAllListingsDto: FindAllListingsDto) {
    return this.listingsService.findAll(findAllListingsDto)
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
