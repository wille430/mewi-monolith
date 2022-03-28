import * as fs from 'fs'
import { ItemData } from '@mewi/types'
import ListingModel from 'models/ListingModel'
// import ScrapeService from './scrapers/ScrapeService'

export default class ItemsService {
    static async deleteOld(daysOld = 2) {
        console.log('Clearing old items...')

        // Convert days into milliseconds
        const millisecondsOld = daysOld * 24 * 60 * 60 * 1000
        const dateToRemove = Date.now() - millisecondsOld

        console.log('Deleting items with post date', new Date(dateToRemove), 'or earlier...')

        // delete old listings
        const { deletedCount: deletedCount1 } = await ListingModel.deleteMany({
            date: { $lte: dateToRemove },
        })

        // delete auctions that have ended
        const { deletedCount: deletedCount2 } = await ListingModel.deleteMany({
            endDate: { $lte: Date.now() },
        })

        console.log('Successfully deleted', deletedCount1 + deletedCount2, 'items')
    }

    /**
     * Add listings to db
     * @param items Array of listings to add to index
     * @returns Amount of items added
     */
    static async addItems(items: ItemData[], test = false): Promise<number> {
        const addedItemsCount = items.length

        if (test) {
            console.log('Appending items to ./build/items.json...')
            for (let i = 0; i < items.length; i++) {
                fs.appendFileSync('./build/items.json', JSON.stringify(items[i]))
            }
        } else {
            try {
                ListingModel.bulkWrite(
                    items.map((x) => ({
                        insertOne: {
                            document: x,
                        },
                    })),
                    { ordered: false }
                )
            } catch (e) {
                console.log(e)
            }
        }

        return addedItemsCount
    }

    // static async clearAndRepopulate() {
    //     const scraper = new ScrapeService()
    //     fs.unlink('./lastDate.txt', async () => {
    //         await ItemsService.deleteOld(0)
    //         await scraper.start()
    //     })
    // }
}
