import Elasticsearch, { elasticClient } from '../config/elasticsearch'
import * as fs from 'fs'
import { ItemData } from '@mewi/types'
// import ScrapeService from './scrapers/ScrapeService'

export default class ItemsService {
    static async deleteOld(daysOld = 2) {
        console.log('Clearing old items...')

        // Convert days into milliseconds
        const millisecondsOld = daysOld * 24 * 60 * 60 * 1000
        const dateToRemove = Date.now() - millisecondsOld

        console.log('Deleting items with post date', new Date(dateToRemove), 'or earlier...')

        const response = await elasticClient.deleteByQuery({
            index: Elasticsearch.defaultIndex,
            body: {
                query: {
                    bool: {
                        should: [
                            { range: { date: { lte: dateToRemove } } },
                            { range: { endDate: { lte: Date.now() } } },
                        ],
                    },
                },
            },
        })

        console.log('Successfully deleted', response.body.deleted, 'items')

        await elasticClient.indices.refresh({ index: Elasticsearch.defaultIndex })
    }

    /**
     * Add items to elasticsearch index
     * @param items Array of items to add to index
     * @param index Elasticsearch index
     * @returns Amount of items added
     */
    static async addItems(items: ItemData[], index = Elasticsearch.defaultIndex): Promise<number> {
        const addedItemsCount = items.length

        if (process.env.DEV_MODE) {
            for (let i = 0; i < items.length; i++) {
                fs.appendFileSync('./build/items.json', JSON.stringify(items[i]))
            }
        } else {
            const body = items.flatMap((item) => [{ index: { _index: index } }, item])

            if (body.length === 0) return 0

            await elasticClient.bulk({
                refresh: true,
                index: index,
                body: body,
            })
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
