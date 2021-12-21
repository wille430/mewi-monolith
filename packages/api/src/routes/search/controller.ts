import { SearchPostRequestBody } from "@mewi/types"
import { elasticClient } from "../../config/elasticsearch"
import SearchService from "../../services/SearchService"
const index = 'items'

export const getAll = async (req, res, next) => {
    const search = await SearchService.search(req.body).catch(next)

    res.status(200).json({
        totalHits: search.body.hits.total.value || 0,
        hits: search.body.hits.hits
    })
}

export const queryWithFilters = async (req, res, next) => {
    const query = req.params.query || ""
    let queryObj = req.body

    queryObj.query.bool.must.push({ match: { title: query } })

    const search = await elasticClient.search({
        index: index,
        body: queryObj
    }).catch(next)

    res.json({
        query: query,
        filters: queryObj,
        totalHits: search.body.hits.total.value || 0,
        hits: search.body.hits.hits
    })
}

export const query = async (req, res, next) => {
    const query = req.params.query || ""

    let queryObj = {
        query: {
            bool: {
                must: [
                    { match: { title: query } }
                ]
            }
        }
    }

    const search = await elasticClient.search({
        index: index,
        body: queryObj
    }).catch(next)

    res.json({
        query: query,
        totalHits: search.body.hits.total.value || 0,
        hits: search.body.hits.hits
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

    let results
    if (options.searchFilters && Object.keys(options.searchFilters).length > 0) {
        console.log('Searching with filters:', options.searchFilters)
        const query = SearchService.createElasticQuery(options.searchFilters)
        results = await elasticClient.search({
            index: index,
            body: {
                query: query
            }
        })
    } else {
        results = await elasticClient.search({
            index: index,
            body: {}
        })
    }


    res.status(200).json({
        options: options,
        totalHits: results.body.hits?.total?.value || 0,
        hits: results.body.hits?.hits || []
    })
}