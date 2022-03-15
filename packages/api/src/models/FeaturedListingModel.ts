import { Listing, ListingSchema } from 'models/ListingModel'
import * as mongoose from 'mongoose'

const FeaturedListingModel = mongoose.model<Listing>('featured', ListingSchema)

export default FeaturedListingModel
