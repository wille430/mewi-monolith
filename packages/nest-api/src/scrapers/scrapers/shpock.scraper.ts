import { Inject } from '@nestjs/common'
import { ListingOrigin, Prisma, Category, Currency } from '@mewi/prisma'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import puppeteer from 'puppeteer'
import { ListingScraper } from '../classes/ListingScraper'
import { PrismaService } from '@/prisma/prisma.service'
import { ScrapeContext } from '../classes/types/ScrapeContext'

export class ShpockScraper extends ListingScraper {
    limit = 25
    _token: undefined | string
    _originCategories: undefined | any[]

    baseUrl = 'https://shpock.com/'
    defaultScrapeUrl = 'https://www.shpock.com/graphql'
    origin: ListingOrigin = ListingOrigin.Shpock

    readonly defaultAxiosRequestConfig: AxiosRequestConfig<any> = {
        method: 'POST',
        url: this.defaultScrapeUrl,
    }

    constructor(@Inject(PrismaService) prisma: PrismaService) {
        super(prisma)

        this.createEntryPoint(async (p) => ({
            data: {
                operationName: 'ItemSearch',
                variables: {
                    trackingSource: 'Search',
                    pagination: {
                        limit: this.limit,
                        od: await this.token,
                        offset: (p - 1) * this.limit,
                    },
                },
                query: 'query ItemSearch($serializedFilters: String, $pagination: Pagination, $trackingSource: TrackingSource!) {\n  itemSearch(\n    serializedFilters: $serializedFilters\n    pagination: $pagination\n    trackingSource: $trackingSource\n  ) {\n    __typename\n    od\n    offset\n    limit\n    count\n    total\n    adKeywords\n    locality\n    spotlightCarousel {\n      ...carouselSummaryFragment\n      __typename\n    }\n    itemResults {\n      distanceGroup\n      items {\n        ...summaryFragment\n        __typename\n      }\n      __typename\n    }\n    filters {\n      __typename\n      kind\n      key\n      triggerLabel\n      serializedValue\n      status\n      ... on CascaderFilter {\n        dataSourceKind\n        __typename\n      }\n      ... on SingleSelectListFilter {\n        title\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        defaultSerializedValue\n        __typename\n      }\n      ... on MultiSelectListFilter {\n        title\n        submitLabel\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        __typename\n      }\n      ... on SearchableMultiSelectListFilter {\n        title\n        submitLabel\n        searchEndpoint\n        __typename\n      }\n      ... on RangeFilter {\n        title\n        __typename\n      }\n      ... on LegacyPriceFilter {\n        title\n        __typename\n      }\n      ... on LegacyLocationFilter {\n        title\n        __typename\n      }\n      ... on RadioToggleFilter {\n        options {\n          __typename\n          label\n          value\n        }\n        defaultSerializedValue\n        __typename\n      }\n    }\n    floatingFilter {\n      name\n      options {\n        label\n        value\n        isSelected\n        __typename\n      }\n      __typename\n    }\n    savedSearchProposal {\n      isAlreadySaved\n      candidate {\n        id\n        name\n        keyword\n        serializedFilters\n        isNotificationChannelOn\n        isEmailChannelOn\n        displayedFilters {\n          name\n          value\n          format\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}\n\nfragment summaryFragment on Summary {\n  __typename\n  ... on ItemSummary {\n    ...itemSummaryFragment\n    __typename\n  }\n  ... on ShopSummary {\n    ...shopSummaryFragment\n    __typename\n  }\n}\n\nfragment itemSummaryFragment on ItemSummary {\n  id\n  title\n  media {\n    id\n    width\n    height\n    title\n    __typename\n  }\n  description\n  path\n  distance\n  distanceUnit\n  locality\n  price\n  originalPrice\n  currency\n  ...itemSummaryTagsFragment\n  canonicalURL\n  __typename\n}\n\nfragment itemSummaryTagsFragment on ItemSummary {\n  isNew\n  isSold\n  isFree\n  isOnSale\n  isLiked\n  isBoosted\n  isShippable\n  isOnHold\n  __typename\n}\n\nfragment shopSummaryFragment on ShopSummary {\n  __typename\n  id\n  name\n  avatar {\n    id\n    __typename\n  }\n  media {\n    id\n    __typename\n  }\n  itemCount\n}\n\nfragment carouselSummaryFragment on CarouselSummary {\n  __typename\n  label\n  group\n  items {\n    id\n    title\n    description\n    media {\n      id\n      width\n      height\n      title\n      __typename\n    }\n    path\n    price\n    originalPrice\n    currency\n    ...itemSummaryTagsFragment\n    canonicalURL\n    __typename\n  }\n}\n',
            },
        }))

        this.defaultStartOptions = {
            watchOptions: {
                findFirst: 'origin_id',
            },
        }
    }

    createScrapeUrl = () => this.defaultScrapeUrl

    get token() {
        if (this._token) {
            return this._token
        }

        // eslint-disable-next-line no-async-promise-executor
        return new Promise<string>(async (resolve) => {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
            })

            try {
                // fetch token
                const page = await browser.newPage()
                await page.goto(new URL('/en-gb/results', this.baseUrl).toString())

                const token = await page.evaluate(() => {
                    const text = document.querySelector('#__NEXT_DATA__').textContent
                    const json = JSON.parse(text)

                    return json.props.pageProps.apolloState.ROOT_QUERY[
                        'itemSearch({"pagination":{"limit":40},"serializedFilters":"{}","trackingSource":"Search"})'
                    ].od
                })

                await browser.close()
                this._token = token
                resolve(token)
            } catch (e) {
                await browser.close()
                resolve('')
            }
        })
    }

    extractRawListingsArray(res: AxiosResponse<any, any>) {
        if (res.data.data.itemSearch) {
            this._token = res.data.data.itemSearch.od
            return res.data.data.itemSearch.itemResults[0].items
        } else {
            return []
        }
    }

    parseRawListing(item: Record<string, any>, context: ScrapeContext): Prisma.ListingCreateInput {
        return {
            origin_id: this.createId(item.id),
            title: item.title,
            body: item.descrpition,
            // TODO: fix category
            // category: await this.parseCategory(item.category[0]),
            category: Category.OVRIGT,
            date: new Date(),
            imageUrl: item.media.map((o) => `https://webimg.secondhandapp.at/w-i-m/${o.id}`),
            redirectUrl: item.canonicalURL,
            isAuction: false,
            price: item.price
                ? {
                      value: item.price,
                      currency: Currency.SEK,
                  }
                : null,
            origin: ListingOrigin.Shpock,
            entryPoint: context.entryPoint.identifier,
        }
    }

    get originCategories() {
        if (this._originCategories) {
            return this._originCategories
        } else {
            // eslint-disable-next-line no-async-promise-executor
            return new Promise<any[]>(async (resolve) => {
                const data = await axios
                    .post(this.createScrapeUrl() + 'graphql', {
                        operationName: 'Categories',
                        query: 'query Categories {\n  categories {\n    id\n    label\n    slugs\n    __typename\n  }\n}\n',
                        variables: {},
                    })
                    .then((res) => res.data)

                const categories = data.data.categories
                this._originCategories = categories

                resolve(categories)
            })
        }
    }

    parseCategory(catShort: any): Category {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise<Category>(async (resolve) => {
            const cat = (await this.originCategories).find((x) => x.id === catShort).label
            resolve(super.parseCategory(cat))
        }) as any
    }
}
