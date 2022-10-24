/* eslint-disable no-case-declarations */
import { ListingSort } from '@wille430/common'
import { DEFAULT_LIMIT, MIN_SEARCH_SCORE } from '../constants'
import type { FindAllListingsDto } from '../dto/find-all-listing.dto'

export const sortPipelineStage = (field: keyof FindAllListingsDto, value: any): any[] => {
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
}

export const filterPipelineStage = (
    field: keyof FindAllListingsDto,
    value: any,
    dto: Partial<FindAllListingsDto>
): any[] => {
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
        case 'categories':
            return [{ $match: { category: { $in: value } } }]
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
                .filter((x: string) => !!x && !new RegExp(/^,$/).test(x))
                .map((x: string) => x.trim())

            return [
                {
                    $match: {
                        region: {
                            $regex: (`^` +
                                regions.map((reg: any) => '(?=.*\\b' + reg + '\\b)').join('') +
                                '.+') as any,
                            $options: 'i',
                        },
                    },
                },
            ]
        case 'sort':
            return sortPipelineStage(field, value)
        case 'page':
            return [
                {
                    $skip: (value - 1) * (dto.limit ?? DEFAULT_LIMIT),
                },
            ]
        case 'limit':
            return [{ $limit: value }]
        case 'origins':
            return [{ $match: { origin: { $in: value } } }]
        default:
            return []
    }
}
