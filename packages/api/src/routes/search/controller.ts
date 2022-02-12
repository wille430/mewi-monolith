import { SearchPostRequestBody, SortData } from '@mewi/types'
import { elasticClient } from '../../config/elasticsearch'
import SearchService from '../../services/SearchService'
const index = 'items'

export const getAll = async (req, res, next) => {
    const search = await SearchService.search().catch(next)

    res.status(200).json({
        totalHits: search.body.hits.total.value || 0,
        hits: search.body.hits.hits,
    })
}

export const suggest = async (req, res) => {
    const { keyword } = req.params
    const suggestions = await SearchService.autocomplete(keyword)

    res.status(200).json(suggestions)
}

export const findById = async (req, res) => {
    const { item_id } = req.params
    const response = await SearchService.findById(item_id)

    res.status(200).json(response)
}

export const getSearchResults = async (req, res) => {
    const options: SearchPostRequestBody = req.body

    let sort: Record<string, 'asc' | 'desc'>

    switch (options.sort) {
        case SortData.DATE_ASC:
            sort = { date: 'asc' }
            break
        case SortData.DATE_DESC:
            sort = { date: 'desc' }
            break
        case SortData.PRICE_ASC:
            sort = { 'price.value': 'asc' }
            break
        case SortData.PRICE_DESC:
            sort = { 'price.value': 'desc' }
            break
    }

    let results
    if (options.searchFilters && Object.keys(options.searchFilters).length > 0) {
        const query = SearchService.createElasticQuery(options.searchFilters)
        results = await elasticClient.search({
            index: index,
            body: {
                query: query,
                sort: sort ? [sort] : [],
                ...SearchService.calculateFromAndSize(options.page),
            },
        })
    } else {
        results = await elasticClient.search({
            index: index,
            body: {
                sort: sort ? [sort] : [],
                ...SearchService.calculateFromAndSize(options.page),
            },
        })
    }

    res.status(200).json({
        options: options,
        totalHits: results.body.hits?.total?.value || 0,
        hits: results.body.hits?.hits || [],
    })
}
