import { ItemData, Types.ListingSearchFilters, SearchOptions, Sort } from '@mewi/common'
import ListingModel from 'models/ListingModel'
import { FilterQuery, QueryOptions } from 'mongoose'
import { generateMockItemData } from '@mewi/common/utils'
import ItemsService from 'services/ItemsService'

export default class SearchService {
    static limit = 20

    static async search(
        query?: Types.ListingSearchFilters,
        options?: SearchOptions
    ): Promise<{ hits: ItemData[]; totalHits: number }> {
        const filterQuery = this.createDbFilters(query)
        const queryOptions: QueryOptions = {}

        switch (options.sort) {
            case Sort.DATE_ASC:
                queryOptions.sort = { date: 1 }
                break
            case Sort.DATE_DESC:
                queryOptions.sort = { date: -1 }
                break
            case Sort.PRICE_ASC:
                queryOptions.sort = { 'price.value': 1 }
                break
            case Sort.PRICE_DESC:
                queryOptions.sort = { 'price.value': -1 }
                break
        }

        if (options.limit) {
            queryOptions.limit = options.limit
        } else {
            const { from, size } = SearchService.calculateFromAndSize(options.page)
            queryOptions.limit = size
            queryOptions.skip = from
        }

        return {
            hits: await ListingModel.find(filterQuery, null, queryOptions).lean(),
            totalHits: await ListingModel.find(filterQuery, null).count(),
        }
    }

    static async autocomplete(keyword): Promise<string[]> {
        const response = await ListingModel.aggregate([
            { $match: { $text: { $search: keyword } } },
            { $limit: 5 },
            { $project: { _id: 0, title: 1 } },
        ])

        return response.map((x) => x.title)
    }

    static async findById(id: string) {
        try {
            const listing = await ListingModel.findOne({ id })
            return listing
        } catch (e) {
            return undefined
        }
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

    static createDbFilters(searchFilterData: Types.ListingSearchFilters): FilterQuery<ItemData> {
        const filterQuery: FilterQuery<ItemData> = {}

        console.log('Creating query from ', JSON.stringify(searchFilterData))

        Object.keys(searchFilterData).forEach((key) => {
            switch (key as keyof Types.ListingSearchFilters) {
                case 'keyword':
                    if (!searchFilterData[key]) break
                    filterQuery.$text = {
                        ...(filterQuery.$text || []),
                        $search: searchFilterData[key],
                    }
                    break
                case 'regions':
                    if (Array.isArray(searchFilterData[key])) {
                        filterQuery.$and = [
                            ...(filterQuery.$and || []),
                            { region: (searchFilterData[key] as string[]).join(', ') },
                        ]
                    } else {
                        filterQuery.$and = [
                            ...(filterQuery.$and || []),
                            { region: [searchFilterData[key] as string].join(', ') },
                        ]
                    }
                    break
                case 'category':
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { category: { $all: searchFilterData[key] } },
                    ]
                    break
                case 'auction':
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { isAuction: searchFilterData[key] },
                    ]
                    break
                case key.match(/priceRange(Gte|Lte)/)?.input:
                    if (key.match(/(Gte)$/)) {
                        filterQuery.$and = [
                            ...(filterQuery.$and || []),
                            { 'price.value': { $gte: searchFilterData[key] } },
                        ]
                    } else if (key.match(/(Lte)$/)) {
                        filterQuery.$and = [
                            ...(filterQuery.$and || []),
                            { 'price.value': { $lte: searchFilterData[key] } },
                        ]
                    }
                    break
                case 'dateGte':
                    filterQuery.$and = [
                        ...(filterQuery.$and || []),
                        { date: { $gte: searchFilterData[key] } },
                    ]

                    break
            }
        })

        return filterQuery
    }

    static async populateWithMockData(count = 100) {
        await ItemsService.addItems(generateMockItemData(count) as ItemData[])
    }
}
