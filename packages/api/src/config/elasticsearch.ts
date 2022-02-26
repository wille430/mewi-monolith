import { Client } from '@elastic/elasticsearch'
import { ItemData } from '@mewi/types'
import _ from 'lodash'
import ItemsService from 'services/ItemsService'
import { generateMockItemData } from 'utils/testUtils'

class Elasticsearch {
    static hostUrl = process.env.SEARCH_ENGINE_URL || 'localhost'
    static hostPort = process.env.SEARCH_ENGINE_PORT || '9200'
    static url = `http://${this.hostUrl}:${this.hostPort}`
    static defaultIndex = 'items'

    static async prepare() {
        const exists = elasticClient.indices
            .exists({ index: this.defaultIndex })
            .then((res) => res.body)
        if (exists) {
            // do nothing
            console.log(`Index ${this.defaultIndex} exists already`)
        } else {
            // create index
            elasticClient.indices.create({ index: this.defaultIndex })
        }
    }

    static async populateWithFakeData(count = 1000) {
        let addedItems = 0

        while (addedItems < count) {
            const itemsToAdd = _.min([100, count - addedItems])
            console.log(`Adding ${itemsToAdd} items...`)
            const items = generateMockItemData(itemsToAdd) as ItemData[]

            await ItemsService.addItems(items)

            addedItems += itemsToAdd
        }
    }

    static async itemsInDb() {
        return (await elasticClient.count({ index: this.defaultIndex })).body.count
    }
}

export const elasticClient = new Client({ node: Elasticsearch.url })

export default Elasticsearch
