import FeaturedListingModel from 'models/FeaturedListingModel'
import ListingModel, { Listing } from 'models/ListingModel'
import nodeSchedule from 'node-schedule'

const FEATURED_ITEMS_COUNT = 5

const update = async () => {
    const randomListings: Listing[] = await ListingModel.aggregate([
        { $sample: { size: FEATURED_ITEMS_COUNT } },
    ])

    // replace listings in collection
    await FeaturedListingModel.deleteMany({})

    const bulkWrites = randomListings.map((x) => ({ insertOne: { document: x } }))

    await FeaturedListingModel.bulkWrite(bulkWrites)
}

const schedule = async () => {
    // update right away if empty
    if ((await FeaturedListingModel.count({})) === 0) {
        update()
    }

    nodeSchedule.scheduleJob('12 30 * * *', () => {
        update()
    })
}

export default {
    update,
    schedule,
}
