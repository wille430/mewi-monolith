/* eslint-disable no-case-declarations */
import { ListingSort } from '@wille430/common'
import { MIN_SEARCH_SCORE } from '../constants'
import { FindAllListingsDto } from '../dto/find-all-listing.dto'

export const filterPipelineStage = (field: keyof FindAllListingsDto, value: any): any[] => {
    if (!value) {
        return []
    }

    switch (field) {
        case 'keyword':
            return [
                {
                    $search: {
                        index:
                            process.env.NODE_ENV === 'production'
                                ? 'listing_search_prod'
                                : 'listing_search_dev',
                        text: {
                            query: value as string,
                            path: {
                                wildcard: '*',
                            },
                            fuzzy: {},
                        },
                    },
                },
                {
                    $addFields: {
                        score: { $meta: 'searchScore' },
                    },
                },
                { $match: { score: { $gte: MIN_SEARCH_SCORE } } },
            ]
        case 'auction':
            return [{ $match: { auction: value } }]
        case 'category':
            return [{ $match: { category: value } }]
        case 'dateGte':
            return [
                {
                    $match: {
                        date: {
                            $gte: {
                                $date: value,
                            },
                        },
                    },
                },
            ]
        case 'priceRangeGte':
            return [{ $match: { 'price.value': { $gte: value } } }]
        case 'priceRangeLte':
            return [{ $match: { 'price.value': { $lte: value } } }]
        case 'region':
            const regions = value
                .split(/(\.|,| )? /i)
                .filter((x) => !!x && !new RegExp(/^,$/).test(x))
                .map((x) => x.trim())

            return [
                {
                    $match: {
                        region: {
                            $regex: (`^` +
                                regions.map((reg) => '(?=.*\\b' + reg + '\\b)').join('') +
                                '.+') as any,
                            $options: 'i',
                        },
                    },
                },
            ]
        case 'sort':
            const listingSortToOrderBy: Record<ListingSort, any> = {
                [ListingSort.DATE_ASC]: {
                    date: 1,
                },
                [ListingSort.DATE_DESC]: {
                    date: -1,
                },
                [ListingSort.PRICE_ASC]: {
                    'price.value': 1,
                },
                [ListingSort.PRICE_DESC]: {
                    'price.value': -1,
                },
                [ListingSort.RELEVANCE]: undefined,
            }

            return [{ $sort: listingSortToOrderBy[value as ListingSort] }]
        case 'page':
            return [
                {
                    $skip: (value - 1) * (value ?? 20),
                },
            ]
        case 'limit':
            return [{ $limit: value }]
        default:
            return []
    }
}
