import {AbstractListingScraperFactory} from "./AbstractListingScraperFactory";
import {WebScraperContext} from "../context/WebScraperContext";
import {ShpockConfig, ShpockContext} from "../context/ShpockContext";
import {IFetchStrategy} from "../fetchers/FetchStrategy";
import {
    IFetchDoneStrategy,
    LimitIsLessStrategy,
} from "../fetchers/FetchDoneStrategy";
import {Listing} from "@mewi/entities";
import {WebScraper} from "../WebScraper";
import {JsonFetchStrategy} from "../fetchers/JsonFetchStrategy";
import {IPaginationStrategy} from "../pagination/PaginationStrategy";
import {AxiosRequestConfig} from "axios";
import {RequestBodyPaginationStrategy} from "../pagination/RequestBodyPaginationStrategy";
import {IParseStrategy} from "../parsers/ParseStrategy";
import {ShpockParseStrategy} from "../parsers/ShpockParseStrategy";
import {ListingOrigin} from "@mewi/models";
import {IErrorHandler} from "../error/ErrorHandler";
import {ShpockErrorHandler} from "../error/ShpockErrorHandler";
import {IAuthStrategy} from "../auth/AuthStrategy";
import {NextAuthInBodyStrategy} from "../auth/NextAuthInBodyStrategy";
import {FetchTokenFromDocument} from "../auth/FetchTokenFromDocument";

export class ShpockScraperFactory extends AbstractListingScraperFactory<
    Record<any, any>
> {
    createContext(): WebScraperContext {
        return new ShpockContext();
    }

    createFetchDoneStrategy(
        fetchStrategy: IFetchStrategy<Record<any, any>>
    ): IFetchDoneStrategy<Listing[]> {
        return new LimitIsLessStrategy();
    }

    createFetchStrategy(
        webScraper: WebScraper<Listing, Record<any, any>>
    ): IFetchStrategy<Record<any, any>> {
        return new JsonFetchStrategy(
            ...this.getFetchStrategyArgs(webScraper)
        ).setFetchDoneStrategy(this.createFetchDoneStrategy);
    }

    createPaginationStrategy(
        webScraper: WebScraper<Listing, Record<any, any>>
    ): IPaginationStrategy<AxiosRequestConfig> {
        return new RequestBodyPaginationStrategy({
            limitPath: "data.variables.pagination.limit",
            offsetPath: "data.variables.pagination.offset",
            defaultLimit: ShpockConfig.limit,
            data: {
                operationName: "ItemSearch",
                variables: {
                    trackingSource: "Search",
                },
                query:
                    "query ItemSearch($serializedFilters: String, $pagination: Pagination, $trackingSource: TrackingSource!) {\n  itemSearch(\n    serializedFilters: $serializedFilters\n    pagination: $pagination\n    trackingSource: $trackingSource\n  ) {\n    __typename\n    od\n    offset\n    limit\n    count\n    total\n    adKeywords\n    locality\n    spotlightCarousel {\n      ...carouselSummaryFragment\n      __typename\n    }\n    itemResults {\n      distanceGroup\n      items {\n        ...summaryFragment\n        __typename\n      }\n      __typename\n    }\n    filters {\n      __typename\n      kind\n      key\n      triggerLabel\n      serializedValue\n      status\n      ... on CascaderFilter {\n        dataSourceKind\n        __typename\n      }\n      ... on SingleSelectListFilter {\n        title\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        defaultSerializedValue\n        __typename\n      }\n      ... on MultiSelectListFilter {\n        title\n        submitLabel\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        __typename\n      }\n      ... on SearchableMultiSelectListFilter {\n        title\n        submitLabel\n        searchEndpoint\n        __typename\n      }\n      ... on RangeFilter {\n        title\n        __typename\n      }\n      ... on LegacyPriceFilter {\n        title\n        __typename\n      }\n      ... on LegacyLocationFilter {\n        title\n        __typename\n      }\n      ... on RadioToggleFilter {\n        options {\n          __typename\n          label\n          value\n        }\n        defaultSerializedValue\n        __typename\n      }\n    }\n    savedSearchProposal {\n      isAlreadySaved\n      candidate {\n        id\n        name\n        keyword\n        serializedFilters\n        isNotificationChannelOn\n        isEmailChannelOn\n        displayedFilters {\n          name\n          value\n          format\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}\n\nfragment summaryFragment on Summary {\n  __typename\n  ... on ItemSummary {\n    ...itemSummaryFragment\n    __typename\n  }\n  ... on ShopSummary {\n    ...shopSummaryFragment\n    __typename\n  }\n  ... on HeaderSummary {\n    title\n    subtitle\n    __typename\n  }\n}\n\nfragment itemSummaryFragment on ItemSummary {\n  id\n  title\n  media {\n    id\n    width\n    height\n    title\n    __typename\n  }\n  description\n  path\n  distance\n  distanceUnit\n  locality\n  price\n  originalPrice\n  currency\n  watchlistToggle\n  ...itemSummaryTagsFragment\n  canonicalURL\n  __typename\n}\n\nfragment itemSummaryTagsFragment on ItemSummary {\n  isNew\n  isSold\n  isFree\n  isOnSale\n  isLiked\n  isBoosted\n  isShippable\n  isExpired\n  __typename\n}\n\nfragment shopSummaryFragment on ShopSummary {\n  __typename\n  id\n  name\n  avatar {\n    id\n    __typename\n  }\n  media {\n    id\n    __typename\n  }\n  itemCount\n}\n\nfragment carouselSummaryFragment on CarouselSummary {\n  __typename\n  label\n  group\n  items {\n    id\n    title\n    description\n    media {\n      id\n      width\n      height\n      title\n      __typename\n    }\n    path\n    price\n    originalPrice\n    currency\n    watchlistToggle\n    ...itemSummaryTagsFragment\n    canonicalURL\n    __typename\n  }\n}\n",
            },
        });
    }

    createParseStrategy(
        webScraper: WebScraper<Listing, Record<any, any>>
    ): IParseStrategy<Record<any, any>, Listing> {
        return new ShpockParseStrategy(webScraper);
    }

    getOrigin(): ListingOrigin {
        return ListingOrigin.Shpock;
    }

    createErrorHandler(): IErrorHandler<any> {
        return new ShpockErrorHandler();
    }

    createAuthStrategy(): IAuthStrategy {
        return new NextAuthInBodyStrategy(
            new FetchTokenFromDocument(
                "https://shpock.com/en-gb/results",
                "props.pageProps.apolloState.ROOT_QUERY['itemSearch({'pagination':{'limit':40},'serializedFilters':'{}','trackingSource':'Search'})'].od"
            ),
            "data.variables.pagination.od"
        );
    }
}