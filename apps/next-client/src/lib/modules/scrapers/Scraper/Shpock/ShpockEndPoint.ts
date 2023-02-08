import { Category, Currency, ListingOrigin } from '@/common/schemas'
import { Listing } from '@/lib/modules/schemas/listing.schema'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import { ConfigMiddleware, NextEndPoint } from '../EndPoint'
import { ScrapePagination } from '../interface/scrape-pagination.inteface'
import { ListingParser } from '../ListingParser'
import { ScrapeMetadata } from '../Scraper'

export class ShpockEndPoint extends NextEndPoint<Listing> {
    protected configMiddlewares: ConfigMiddleware[] = []
    private limit = 25
    private token?: string
    private parser: ListingParser = new ListingParser(ListingOrigin.Shpock, this)

    constructor() {
        super('https://shpock.com/en-gb/results', ShpockEndPoint.name)
    }

    protected async createAxiosConfig({
        page = 1,
    }: ScrapePagination): Promise<AxiosRequestConfig<any>> {
        return {
            method: 'POST',
            url: 'https://www.shpock.com/graphql',
            data: {
                operationName: 'ItemSearch',
                variables: {
                    trackingSource: 'Search',
                    pagination: {
                        limit: this.limit,
                        od: await this.getOd(),
                        offset: (page - 1) * this.limit,
                    },
                },
                query: 'query ItemSearch($serializedFilters: String, $pagination: Pagination, $trackingSource: TrackingSource!) {\n  itemSearch(\n    serializedFilters: $serializedFilters\n    pagination: $pagination\n    trackingSource: $trackingSource\n  ) {\n    __typename\n    od\n    offset\n    limit\n    count\n    total\n    adKeywords\n    locality\n    spotlightCarousel {\n      ...carouselSummaryFragment\n      __typename\n    }\n    itemResults {\n      distanceGroup\n      items {\n        ...summaryFragment\n        __typename\n      }\n      __typename\n    }\n    filters {\n      __typename\n      kind\n      key\n      triggerLabel\n      serializedValue\n      status\n      ... on CascaderFilter {\n        dataSourceKind\n        __typename\n      }\n      ... on SingleSelectListFilter {\n        title\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        defaultSerializedValue\n        __typename\n      }\n      ... on MultiSelectListFilter {\n        title\n        submitLabel\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        __typename\n      }\n      ... on SearchableMultiSelectListFilter {\n        title\n        submitLabel\n        searchEndpoint\n        __typename\n      }\n      ... on RangeFilter {\n        title\n        __typename\n      }\n      ... on LegacyPriceFilter {\n        title\n        __typename\n      }\n      ... on LegacyLocationFilter {\n        title\n        __typename\n      }\n      ... on RadioToggleFilter {\n        options {\n          __typename\n          label\n          value\n        }\n        defaultSerializedValue\n        __typename\n      }\n    }\n    savedSearchProposal {\n      isAlreadySaved\n      candidate {\n        id\n        name\n        keyword\n        serializedFilters\n        isNotificationChannelOn\n        isEmailChannelOn\n        displayedFilters {\n          name\n          value\n          format\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}\n\nfragment summaryFragment on Summary {\n  __typename\n  ... on ItemSummary {\n    ...itemSummaryFragment\n    __typename\n  }\n  ... on ShopSummary {\n    ...shopSummaryFragment\n    __typename\n  }\n  ... on HeaderSummary {\n    title\n    subtitle\n    __typename\n  }\n}\n\nfragment itemSummaryFragment on ItemSummary {\n  id\n  title\n  media {\n    id\n    width\n    height\n    title\n    __typename\n  }\n  description\n  path\n  distance\n  distanceUnit\n  locality\n  price\n  originalPrice\n  currency\n  watchlistToggle\n  ...itemSummaryTagsFragment\n  canonicalURL\n  __typename\n}\n\nfragment itemSummaryTagsFragment on ItemSummary {\n  isNew\n  isSold\n  isFree\n  isOnSale\n  isLiked\n  isBoosted\n  isShippable\n  isExpired\n  __typename\n}\n\nfragment shopSummaryFragment on ShopSummary {\n  __typename\n  id\n  name\n  avatar {\n    id\n    __typename\n  }\n  media {\n    id\n    __typename\n  }\n  itemCount\n}\n\nfragment carouselSummaryFragment on CarouselSummary {\n  __typename\n  label\n  group\n  items {\n    id\n    title\n    description\n    media {\n      id\n      width\n      height\n      title\n      __typename\n    }\n    path\n    price\n    originalPrice\n    currency\n    watchlistToggle\n    ...itemSummaryTagsFragment\n    canonicalURL\n    __typename\n  }\n}\n',
            },
        }
    }

    async getOd() {
        if (!this.token) {
            const data = await this.getNextData()
            this.token =
                data.props.pageProps.apolloState.ROOT_QUERY[
                    'itemSearch({"pagination":{"limit":40},"serializedFilters":"{}","trackingSource":"Search"})'
                ].od
        }

        return this.token
    }

    protected extractEntities(res: AxiosResponse<any, any>): any[] | Promise<any[]> {
        if (res.data.data.itemSearch) {
            this.token = res.data.data.itemSearch.od
            return res.data.data.itemSearch.itemResults[0].items
        } else {
            return []
        }
    }

    protected parseRawEntity(obj: any): Partial<Listing> | Promise<Partial<Listing>> {
        return this.parser.parseListing({
            origin_id: this.parser.createId(obj.id),
            title: obj.title,
            body: obj.descrpition,
            // TODO: fix category
            // category: await this.parseCategory(item.category[0]),
            category: Category.OVRIGT,
            date: new Date(),
            imageUrl: obj.media.map((o: any) => `https://webimg.secondhandapp.at/w-i-m/${o.id}`),
            redirectUrl: obj.canonicalURL,
            isAuction: false,
            price: obj.price
                ? {
                      value: obj.price,
                      currency: Currency.SEK,
                  }
                : undefined,
        })
    }
    protected getScrapeMetadata(): Promise<ScrapeMetadata> {
        return Promise.resolve({})
    }

    // _originCategories: undefined | any[]
    // async originCategories(): Promise<any[]> {
    //     if (this._originCategories) {
    //         return this._originCategories
    //     } else {
    //         // eslint-disable-next-line no-async-promise-executor
    //         const data = await axios
    //             .post(this.createScrapeUrl() + 'graphql', {
    //                 operationName: 'Categories',
    //                 query: 'query Categories {\n  categories {\n    id\n    label\n    slugs\n    __typename\n  }\n}\n',
    //                 variables: {},
    //             })
    //             .then((res) => res.data)

    //         const categories = data.data.categories
    //         this._originCategories = categories

    //         return categories
    //     }
    // }

    // async parseCategory(catShort: any): Promise<Category> {
    //     // Try to fetch categories from Shpock. If it fails, just
    //     // use the inherited method.
    //     try {
    //         const cat = (await this.originCategories()).find((x) => x.id === catShort)?.label
    //         return super.parseCategory(cat)
    //     } catch (e) {
    //         return super.parseCategory(catShort)
    //     }
    // }
}
