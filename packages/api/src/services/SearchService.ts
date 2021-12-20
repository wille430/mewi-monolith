import { ElasticQuery, SearchFilterDataProps } from "@mewi/types";
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

    static createElasticQuery(searchFilterData: SearchFilterDataProps): ElasticQuery {

        const query: ElasticQuery = {
            bool: {
                must: []
            }
        }

        Object.keys(searchFilterData).map(key => {

            switch (key) {
                case 'keyword':
                    query.bool.must.push({ match: { title: searchFilterData[key] } })
                case 'regions':
                    const clauses = []
                    searchFilterData.regions.forEach(region => {
                        clauses.push(
                            { span_term: { region: region } }
                        )
                    })
                    query.bool.must.push({ span_or: { clauses: clauses } })
                case 'category':
                    query.bool.filter.push({ term: { [key]: searchFilterData[key] } })
                case 'auction':
                    query.bool.filter.push({ term: { isAuction: searchFilterData[key] } })
                case 'priceRange':
                    query.bool.filter.push({ range: { 'price.value': searchFilterData[key] } })
            }
        })

        return query
    }
}