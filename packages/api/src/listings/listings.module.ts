import { CacheModule, Module, OnModuleInit } from '@nestjs/common'
import { ListingsService } from './listings.service'
import { ListingsController } from './listings.controller'
import { InjectModel, MongooseModule } from '@nestjs/mongoose'
import { Listing, ListingDocument, ListingSchema } from './listing.schema'
import { Model } from 'mongoose'
import { factory } from 'fakingoose'
import faker from '@faker-js/faker'

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
    exports: [MongooseModule, ListingsService],
})
export class ListingsModule implements OnModuleInit {
    constructor(@InjectModel(Listing.name) private listingModel: Model<ListingDocument>) {}

    async onModuleInit() {
        // populate with fake data
        if (process.env.NODE_ENV !== 'production') {
            const docCount = await this.listingModel.estimatedDocumentCount()
            let remaining = 10000 - docCount

            if (remaining > 0) {
                console.log('Populating with fake data...')

                const listingFactory = factory(ListingSchema)

                while (remaining > 0) {
                    const mock = listingFactory.generate({
                        title: faker.commerce.productName(),
                    })

                    await this.listingModel.create(mock)

                    remaining -= 1
                }
            }
        }
    }
}
