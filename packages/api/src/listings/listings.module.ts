import { CacheModule, Module } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Listing } from 'listings/listing.schema'
import { ListingSchema } from 'models/ListingModel'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Listing.name,
        schema: ListingSchema,
      },
    ]),
    CacheModule.register(),
  ],
  controllers: [ListingsController],
  providers: [ListingsService],
  exports: [MongooseModule],
})
export class ListingsModule {}
