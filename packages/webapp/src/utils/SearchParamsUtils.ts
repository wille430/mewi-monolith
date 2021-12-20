import { ElasticQuery, ElasticSearchBody, PriceRangeProps, SearchFilterDataProps } from '@mewi/types'
import config from 'config'
import { PriceRangeUtils } from 'utils'

const SearchParamsUtils = {
    searchToElasticQuery: (search: string) => {

        const keyword = new URLSearchParams(search).get("q")

        const must = []
        let queryObj: {
            [key: string]: any
        } = {}

        const page = parseInt(new URLSearchParams(search).get("page") || "1")

        SearchParamsUtils.searchParams.forEach(key => {
            const searchParam = new URLSearchParams(search).get(key)
            if (searchParam) {
                // @ts-ignore
                queryObj[key] = searchParam?.split(',').map(value => SearchParamsUtils.keyToObject(key, value))
            }
        })

        if (keyword) {
            must.push({ match: { title: keyword } })
        }

        if (queryObj.region?.length >= 1) {
            must.push({
                span_or: {
                    clauses: [
                        ...queryObj.region
                    ]
                }
            })
        }

        let queryObjToReturn: ElasticSearchBody = {
            query: {
                bool: {
                    must: must,
                    filter: [
                        ...(queryObj.category || []),
                        ...(queryObj.price || []),
                        ...(queryObj.isAuction || [])
                    ]
                }
            },
            sort: [
                ...(queryObj.sort || [])
            ],
            size: config.searchLimit,
            from: (page - 1) * config.searchLimit
        }

        // Remove unnecessary keys
        if (queryObjToReturn.query.bool.filter && queryObjToReturn.query.bool.filter.length <= 0) delete queryObjToReturn.query.bool.filter
        if (queryObjToReturn.sort && queryObjToReturn.sort.length <= 0) delete queryObjToReturn.sort

        return (queryObjToReturn)
    },
    keyToObject: (key: ('region' | 'category' | 'isAuction' | 'price' | 'sort'), value: (boolean | string | number | PriceRangeProps)) => {
        if (!value) return
        switch (key) {
            case 'region':
                return { span_term: { [key]: value } }
            case 'category':
            case 'isAuction':
                return { term: { [key]: value } }
            case 'price':
                return { range: { 'price.value': value } }
            case 'sort':
                switch (value) {
                    case 'relevans':
                        return
                    case 'pris_fallande':
                        return { "price.value": "desc" }
                    case 'pris_stigande':
                        return { "price.value": "asc" }
                    case 'datum_fallande':
                        return { "date": "desc" }
                    case 'datum_stigande':
                        return { "date": "asc" }
                    default:
                        return
                }
            default:
                return

        }
    },
    searchParams: ['category', 'region', 'isAuction', 'price', 'sort', 'page'],
    searchParamsToObj: (URLSearchParams: URLSearchParams): string => {
        let params = URLSearchParams
        params.forEach((key, param) => {
            if (!SearchParamsUtils.searchParams.includes(param)) {
                params.delete(param)
            }
        })
        return params.toString()
    }
}

export default SearchParamsUtils