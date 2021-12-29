import { ElasticQuery, SearchFilterDataProps } from '@mewi/types'
import Elasticsearch, { elasticClient } from '../config/elasticsearch'
import _ from 'lodash'
const axios = require('axios')

export default class SearchService {
    static limit = 20

    static async validateQuery(query): Promise<boolean> {
        return await elasticClient.indices
            .validateQuery({
                index: 'items',
                body: { query },
            })
            .then((x) => x.body.valid)
    }

    static async search(query) {
        return await elasticClient.search({
            index: Elasticsearch.defaultIndex,
            body: query,
        })
    }

    static async autocomplete(keyword) {
        const suggestResponse = await elasticClient.search({
            index: Elasticsearch.defaultIndex,
            body: {
                suggest: {
                    keywordSuggest: {
                        text: keyword,
                        term: { field: 'title' },
                    },
                },
            },
        })

        return suggestResponse.body.suggest.keywordSuggest[0].options
    }

    static async findById(id: string) {
        const response = await elasticClient.get({
            id: id,
            index: Elasticsearch.defaultIndex,
        })

        return response
    }

    static createElasticQuery(searchFilterData: SearchFilterDataProps): ElasticQuery {
        const query: ElasticQuery = {
            bool: {
                must: [],
            },
        }

        Object.keys(searchFilterData).forEach((key) => {
            switch (key) {
                case 'keyword':
                    if (!searchFilterData[key]) break
                    query.bool.must.push({ match: { title: searchFilterData[key] } })
                    break
                case 'regions':
                    query.bool.must.push({ match: { region: searchFilterData[key].join(', ') } })
                    break
                case 'category':
                    if (!query.bool.filter) query.bool.filter = []
                    query.bool.filter.push({ term: { [key]: searchFilterData[key] } })
                    break
                case 'auction':
                    if (!query.bool.filter) query.bool.filter = []
                    query.bool.filter.push({ term: { isAuction: searchFilterData[key] } })
                    break
                case 'priceRange':
                    if (!query.bool.filter) query.bool.filter = []
                    if (!_.size(searchFilterData[key])) break
                    query.bool.filter.push({ range: { 'price.value': searchFilterData[key] } })
                    break
            }
        })

        console.log('Created query:', JSON.stringify(query))

        return query
    }
}
