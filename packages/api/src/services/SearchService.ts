import { ElasticQuery, SearchFilterDataProps } from '@mewi/types'
import Elasticsearch, { elasticClient } from '../config/elasticsearch'

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

    static async search(query?: SearchFilterDataProps) {
        if (query) {
            return await elasticClient.search({
                index: Elasticsearch.defaultIndex,
                body: SearchService.createElasticQuery(query),
            })
        } else {
            return await elasticClient.search({
                index: Elasticsearch.defaultIndex,
            })
        }
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

        return suggestResponse.body.suggest.keywordSuggest[0]?.options
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

        console.log('Creating query from ', JSON.stringify(searchFilterData))

        Object.keys(searchFilterData).forEach((key) => {
            switch (key as keyof SearchFilterDataProps) {
                case 'keyword':
                    if (!searchFilterData[key]) break
                    query.bool.must.push({ match: { title: searchFilterData[key] } })
                    break
                case 'regions':
                    if (Array.isArray(searchFilterData[key])) {
                        query.bool.must.push({
                            match: { region: (searchFilterData[key] as string[]).join(', ') },
                        })
                    } else {
                        query.bool.must.push({
                            match: { region: [searchFilterData[key] as string].join(', ') },
                        })
                    }

                    break
                case 'category':
                    if (!query.bool.filter) query.bool.filter = []
                    query.bool.filter.push({ term: { [key]: searchFilterData[key] } })
                    break
                case 'auction':
                    if (!query.bool.filter) query.bool.filter = []
                    query.bool.filter.push({ term: { isAuction: searchFilterData[key] } })
                    break
                case key.match(/priceRange(Gte|Lte)/)?.input:
                    if (!query.bool.filter) query.bool.filter = []

                    if (key.match(/(Gte)$/)) {
                        query.bool.filter.push({
                            range: {
                                'price.value': {
                                    gte: searchFilterData[key],
                                },
                            },
                        })
                    } else if (key.match(/(Lte)$/)) {
                        query.bool.filter.push({
                            range: {
                                'price.value': {
                                    lte: searchFilterData[key],
                                },
                            },
                        })
                    }
                    break
                case 'dateGte':
                    if (!query.bool.filter) query.bool.filter = []

                    query.bool.filter.push({
                        range: {
                            date: {
                                gte: searchFilterData[key],
                            },
                        },
                    })

                    break
            }
        })

        return query
    }

    static calculateFromAndSize(page = 1) {
        const size = 21

        if (page <= 0) {
            return {
                from: 0,
                size: size,
            }
        } else {
            return {
                from: (page - 1) * size,
                size: size,
            }
        }
    }
}
