import { Client } from '@elastic/elasticsearch'

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
}

export const elasticClient = new Client({ node: Elasticsearch.url })

export default Elasticsearch
