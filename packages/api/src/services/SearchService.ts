import Elasticsearch, { elasticClient } from "../config/elasticsearch";
const axios = require('axios')

export default class SearchService {
    static limit = 20

    static async validateQuery(query): Promise<boolean> {
        return await elasticClient.indices.validateQuery({
            index: 'items',
            body: { query }
        }).then(x => x.body.valid)
    }

    static async search(query) {
        return await elasticClient.search({
            index: Elasticsearch.defaultIndex,
            body: query
        })
    }

    static async autocomplete(keyword) {
        const suggestResponse = await elasticClient.search({
            index: Elasticsearch.defaultIndex,
            body: {
                suggest: {
                    keywordSuggest: {
                        text: keyword,
                        term: { field: 'title' }
                    }
                }
            }
        })

        return suggestResponse.body.suggest.keywordSuggest[0].options
    }

    static async findById(id: string) {
        const response = await elasticClient.get({
            id: id,
            index: Elasticsearch.defaultIndex
        })

        return response
    }
}