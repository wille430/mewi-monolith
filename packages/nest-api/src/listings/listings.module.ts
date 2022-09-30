import { CacheModule, Module } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { UsersModule } from '@/users/users.module'
import { ListingsRepository } from './listings.repository'
import { MongooseModule } from '@nestjs/mongoose'
import { Listing, ListingSchema } from '@/schemas/listing.schema'

@Module({
    imports: [
        CacheModule.register(),
        UsersModule,
        MongooseModule.forFeature([
            {
                name: Listing.name,
                schema: ListingSchema,
            },
        ]),
    ],
    controllers: [ListingsController],
    providers: [ListingsService, ListingsRepository],
    exports: [ListingsService, ListingsRepository],
})
export class ListingsModule {}
