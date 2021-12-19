import { Client } from '@elastic/elasticsearch'

class Elasticsearch {
    static hostUrl = process.env.SEARCH_ENGINE_URL || "localhost"
    static hostPort = process.env.SEARCH_ENGINE_PORT || "9200"
    static url = `http://${this.hostUrl}:${this.hostPort}`
    static defaultIndex = 'items'
}

export const elasticClient = new Client({ node: Elasticsearch.url })

export default Elasticsearch