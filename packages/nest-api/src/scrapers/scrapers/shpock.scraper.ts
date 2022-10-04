import { Inject } from '@nestjs/common'
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import * as puppeteer from 'puppeteer'
import { ListingScraper } from '../classes/ListingScraper'
import { ScrapeContext } from '../classes/types/ScrapeContext'
import { ConfigService } from '@nestjs/config'
import { getNextDataEval } from '../helpers/getNextData'
import { Category, Currency, ListingOrigin } from '@wille430/common'
import { ListingsRepository } from '@/listings/listings.repository'
import { ScrapedListing } from '../classes/types/ScrapedListing'
import { ScrapingLogsRepository } from '../scraping-logs.repository'

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

    constructor(
        @Inject(ListingsRepository) listingsRepository: ListingsRepository,
        @Inject(ScrapingLogsRepository) scrapingLogsRepository: ScrapingLogsRepository,
        @Inject(ConfigService) config: ConfigService
    ) {
        super(listingsRepository, scrapingLogsRepository, config)

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
                query: 'query ItemSearch($serializedFilters: String, $pagination: Pagination, $trackingSource: TrackingSource!) {  itemSearch(    serializedFilters: $serializedFilters    pagination: $pagination    trackingSource: $trackingSource  ) {    __typename    od    offset    limit    count    total    adKeywords    locality    spotlightCarousel {      ...carouselSummaryFragment      __typename    }    itemResults {      distanceGroup      items {        ...summaryFragment        __typename      }      __typename    }    filters {      __typename      kind      key      triggerLabel      serializedValue      status      ... on CascaderFilter {        dataSourceKind        __typename      }      ... on SingleSelectListFilter {        title        options {          __typename          label          subLabel          badgeLabel          serializedValue        }        defaultSerializedValue        __typename      }      ... on MultiSelectListFilter {        title        submitLabel        options {          __typename          label          subLabel          badgeLabel          serializedValue        }        __typename      }      ... on SearchableMultiSelectListFilter {        title        submitLabel        searchEndpoint        __typename      }      ... on RangeFilter {        title        __typename      }      ... on LegacyPriceFilter {        title        __typename      }      ... on LegacyLocationFilter {        title        __typename      }      ... on RadioToggleFilter {        options {          __typename          label          value        }        defaultSerializedValue        __typename      }    }    savedSearchProposal {      isAlreadySaved      candidate {        id        name        keyword        serializedFilters        isNotificationChannelOn        isEmailChannelOn        displayedFilters {          name          value          format          __typename        }        __typename      }      __typename    }  }}fragment summaryFragment on Summary {  __typename  ... on ItemSummary {    ...itemSummaryFragment    __typename  }  ... on ShopSummary {    ...shopSummaryFragment    __typename  }}fragment itemSummaryFragment on ItemSummary {  id  title  media {    id    width    height    title    __typename  }  description  path  distance  distanceUnit  locality  price  originalPrice  currency  ...itemSummaryTagsFragment  canonicalURL  __typename}fragment itemSummaryTagsFragment on ItemSummary {  isNew  isSold  isFree  isOnSale  isLiked  isBoosted  isShippable  isOnHold  __typename}fragment shopSummaryFragment on ShopSummary {  __typename  id  name  avatar {    id    __typename  }  media {    id    __typename  }  itemCount}fragment carouselSummaryFragment on CarouselSummary {  __typename  label  group  items {    id    title    description    media {      id      width      height      title      __typename    }    path    price    originalPrice    currency    ...itemSummaryTagsFragment    canonicalURL    __typename  }}',
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
                const url = new URL('/en-gb/results', this.baseUrl).toString()
                await page.goto(url)

                const nextData = await getNextDataEval(page)
                const token =
                    nextData.props.pageProps.apolloState.ROOT_QUERY[
                        'itemSearch({"pagination":{"limit":40},"serializedFilters":"{}","trackingSource":"Search"})'
                    ].od

                await browser.close()
                this._token = token
                resolve(token)
            } catch (e) {
                await browser.close()
                throw e
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

    parseRawListing(item: Record<string, any>, context: ScrapeContext): ScrapedListing {
        return {
            origin_id: this.createId(item.id),
            title: item.title,
            body: item.descrpition,
            // TODO: fix category
            // category: await this.parseCategory(item.category[0]),
            category: Category.OVRIGT,
            date: new Date(),
            imageUrl: item.media.map((o: any) => `https://webimg.secondhandapp.at/w-i-m/${o.id}`),
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

    async originCategories(): Promise<any[]> {
        if (this._originCategories) {
            return this._originCategories
        } else {
            // eslint-disable-next-line no-async-promise-executor
            const data = await axios
                .post(this.createScrapeUrl() + 'graphql', {
                    operationName: 'Categories',
                    query: 'query Categories {\n  categories {\n    id\n    label\n    slugs\n    __typename\n  }\n}\n',
                    variables: {},
                })
                .then((res) => res.data)

            const categories = data.data.categories
            this._originCategories = categories

            return categories
        }
    }

    async parseCategory(catShort: any): Promise<Category> {
        // Try to fetch categories from Shpock. If it fails, just
        // use the inherited method.
        try {
            const cat = (await this.originCategories()).find((x) => x.id === catShort)?.label
            return super.parseCategory(cat)
        } catch (e) {
            return super.parseCategory(catShort)
        }
    }
}
