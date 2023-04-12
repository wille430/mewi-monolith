import { ListingOrigin } from "@mewi/models";
import { ConfiguredWebScraper, WebScraper } from "./WebScraper";
import {
  IParseStrategy,
  ListingParseStrategyWrapper,
} from "./parsers/ParseStrategy";
import { NextBearerAuthStrategy } from "./auth/NextBearerAuthStrategy";
import { NoAuthStrategy } from "./auth/NoAuthStrategy";
import { JsonFetchStrategy } from "./fetchers/JsonFetchStrategy";
import { HtmlFetchStrategy } from "./fetchers/HtmlFetchStrategy";
import { BlocketParseStrategy } from "./parsers/BlocketParseStrategy";
import { BytbilParseStrategy } from "./parsers/BytbilParseStrategy";
import { UrlQueryParamsPaginationStrategy } from "./pagination/UrlQueryParamsPaginationStrategy";
import { BlocketConfigs } from "./config/BlocketConfigs";
import { BytbilConfig, BytbilConfigs } from "./config/BytbilConfigs";
import {
  HasNextPageStrategy,
  LimitIsLessStrategy,
} from "./fetchers/FetchDoneStrategy";
import { WebScraperConfigs } from "./config/WebScraperConfigs";
import { IPaginationStrategy } from "./pagination/PaginationStrategy";
import { IAuthStrategy } from "./auth/AuthStrategy";
import { TraderaParseStrategy } from "./parsers/TraderaParseStrategy";
import { TraderaConfig, TraderaConfigs } from "./config/TraderaConfigs";
import { SellpyConfigs } from "./config/SellpyConfigs";
import { SellpyParseStrategy } from "./parsers/SellpyParseStrategy";
import { SellpyPaginationStrategy } from "./pagination/SellpyPaginationStrategy";
import { BlippConfigs } from "./config/BlippConfigs";
import { BlippParseStrategy } from "./parsers/BlippParseStrategy";
import { BlippPaginationStrategy } from "./pagination/BlippPaginationStrategy";
import { ShpockConfigs } from "./config/ShpockConfigs";
import { NextAuthInBodyStrategy } from "./auth/NextAuthInBodyStrategy";
import { FetchTokenFromDocument } from "./auth/FetchTokenFromDocument";
import { ShpockParseStrategy } from "./parsers/ShpockParseStrategy";
import { RequestBodyPaginationStrategy } from "./pagination/RequestBodyPaginationStrategy";
import { KvdBilConfigs } from "./config/KvdBilConfigs";
import { KvdBilParseStrategy } from "./parsers/KvdBilParseStrategy";
import { CitiboardConfigs } from "./config/CitiboardConfigs";
import { CitiboardParseStrategy } from "./parsers/CitiboardParseStrategy";
import { BilwebConfig, BilwebConfigs } from "./config/BilwebConfigs";
import { BilwebParseStrategy } from "./parsers/BilwebParseStrategy";
import { NeverStopStrategy } from "./stoppages/NeverStopStrategy";
import { IStopScrapeStrategy } from "./stoppages/StopScrapeStrategy";
import { Listing } from "@mewi/entities";
import { StopAtOldListingStrategy } from "./stoppages/StopAtOldListingStrategy";
import { createClassLogger } from "./logging/logger";

export class WebscraperFactory {
  public createScraper(origin: ListingOrigin): ConfiguredWebScraper<any> {
    const logger = createClassLogger(origin + "Scraper");
    const webScraper = new ConfiguredWebScraper(
      this.createConfig(origin),
      logger
    );

    const parseStrategy = this.createParseStrategy(origin, webScraper);
    const parseStrategyWrapper = new ListingParseStrategyWrapper(
      parseStrategy,
      origin
    );
    const fetchStrategy = this.createFetchStrategy(origin, webScraper);

    const stopScrapeStrategy = this.createStopStrategy(origin);

    webScraper.setParseStrategy(parseStrategyWrapper);
    webScraper.setFetchStrategy(fetchStrategy);
    webScraper.setStopScrapeStrategy(stopScrapeStrategy);

    return webScraper;
  }

  private createPaginationStrategy(origin: ListingOrigin) {
    switch (origin) {
      case ListingOrigin.Blocket:
        return new UrlQueryParamsPaginationStrategy({
          pageStartNumber: 1,
          limitParam: "lim",
          pageParam: "param",
        });
      case ListingOrigin.Bytbil:
        return new UrlQueryParamsPaginationStrategy({
          pageStartNumber: 1,
        });
      case ListingOrigin.Tradera:
        return new UrlQueryParamsPaginationStrategy({
          pageStartNumber: 1,
          pageParam: "spage",
        });
      case ListingOrigin.Sellpy:
        return new SellpyPaginationStrategy();
      case ListingOrigin.Blipp:
        return new BlippPaginationStrategy();
      case ListingOrigin.Shpock:
        return new RequestBodyPaginationStrategy({
          limitPath: "data.variables.pagination.limit",
          offsetPath: "data.variables.pagination.offset",
          data: {
            operationName: "ItemSearch",
            variables: {
              trackingSource: "Search",
            },
            query:
              "query ItemSearch($serializedFilters: String, $pagination: Pagination, $trackingSource: TrackingSource!) {\n  itemSearch(\n    serializedFilters: $serializedFilters\n    pagination: $pagination\n    trackingSource: $trackingSource\n  ) {\n    __typename\n    od\n    offset\n    limit\n    count\n    total\n    adKeywords\n    locality\n    spotlightCarousel {\n      ...carouselSummaryFragment\n      __typename\n    }\n    itemResults {\n      distanceGroup\n      items {\n        ...summaryFragment\n        __typename\n      }\n      __typename\n    }\n    filters {\n      __typename\n      kind\n      key\n      triggerLabel\n      serializedValue\n      status\n      ... on CascaderFilter {\n        dataSourceKind\n        __typename\n      }\n      ... on SingleSelectListFilter {\n        title\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        defaultSerializedValue\n        __typename\n      }\n      ... on MultiSelectListFilter {\n        title\n        submitLabel\n        options {\n          __typename\n          label\n          subLabel\n          badgeLabel\n          serializedValue\n        }\n        __typename\n      }\n      ... on SearchableMultiSelectListFilter {\n        title\n        submitLabel\n        searchEndpoint\n        __typename\n      }\n      ... on RangeFilter {\n        title\n        __typename\n      }\n      ... on LegacyPriceFilter {\n        title\n        __typename\n      }\n      ... on LegacyLocationFilter {\n        title\n        __typename\n      }\n      ... on RadioToggleFilter {\n        options {\n          __typename\n          label\n          value\n        }\n        defaultSerializedValue\n        __typename\n      }\n    }\n    savedSearchProposal {\n      isAlreadySaved\n      candidate {\n        id\n        name\n        keyword\n        serializedFilters\n        isNotificationChannelOn\n        isEmailChannelOn\n        displayedFilters {\n          name\n          value\n          format\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n  }\n}\n\nfragment summaryFragment on Summary {\n  __typename\n  ... on ItemSummary {\n    ...itemSummaryFragment\n    __typename\n  }\n  ... on ShopSummary {\n    ...shopSummaryFragment\n    __typename\n  }\n  ... on HeaderSummary {\n    title\n    subtitle\n    __typename\n  }\n}\n\nfragment itemSummaryFragment on ItemSummary {\n  id\n  title\n  media {\n    id\n    width\n    height\n    title\n    __typename\n  }\n  description\n  path\n  distance\n  distanceUnit\n  locality\n  price\n  originalPrice\n  currency\n  watchlistToggle\n  ...itemSummaryTagsFragment\n  canonicalURL\n  __typename\n}\n\nfragment itemSummaryTagsFragment on ItemSummary {\n  isNew\n  isSold\n  isFree\n  isOnSale\n  isLiked\n  isBoosted\n  isShippable\n  isExpired\n  __typename\n}\n\nfragment shopSummaryFragment on ShopSummary {\n  __typename\n  id\n  name\n  avatar {\n    id\n    __typename\n  }\n  media {\n    id\n    __typename\n  }\n  itemCount\n}\n\nfragment carouselSummaryFragment on CarouselSummary {\n  __typename\n  label\n  group\n  items {\n    id\n    title\n    description\n    media {\n      id\n      width\n      height\n      title\n      __typename\n    }\n    path\n    price\n    originalPrice\n    currency\n    watchlistToggle\n    ...itemSummaryTagsFragment\n    canonicalURL\n    __typename\n  }\n}\n",
          },
        });
      case ListingOrigin.Kvdbil:
        return new UrlQueryParamsPaginationStrategy({
          pageStartNumber: 0,
          limitParam: "limit",
          offsetParam: "offset",
        });
      case ListingOrigin.Citiboard:
        return new UrlQueryParamsPaginationStrategy({
          pageStartNumber: 1,
          pageParam: "sida",
        });
      case ListingOrigin.Bilweb:
        return new UrlQueryParamsPaginationStrategy({
          limitParam: "limit",
          offsetParam: "offset",
        });
      default:
        throw new Error(
          `No PaginationStrategy has been implemented for ${origin}`
        );
    }
  }

  private createFetchStrategy(
    origin: ListingOrigin,
    webScraper: WebScraper<any>
  ) {
    const args: [IPaginationStrategy<any>, IAuthStrategy, WebScraper<any>] = [
      this.createPaginationStrategy(origin),
      this.createAuthStrategy(origin),
      // this.createUrlStrategy(origin),
      webScraper,
    ];

    switch (origin) {
      case ListingOrigin.Bytbil:
      case ListingOrigin.Bilweb:
        return new HtmlFetchStrategy(...args).setFetchDoneStrategy(
          (o) => new HasNextPageStrategy(o)
        );
      case ListingOrigin.Blocket:
      case ListingOrigin.Tradera:
      case ListingOrigin.Blipp:
      case ListingOrigin.Sellpy:
      case ListingOrigin.Kvdbil:
      case ListingOrigin.Shpock:
      case ListingOrigin.Citiboard:
        return new JsonFetchStrategy(...args).setFetchDoneStrategy(
          (o) => new LimitIsLessStrategy(o)
        );
      default:
        throw new Error(`No FetchStrategy has been implemented for ${origin}`);
    }
  }

  private createParseStrategy(
    origin: ListingOrigin,
    webScraper: WebScraper<any>
  ): IParseStrategy<any, any> {
    switch (origin) {
      case ListingOrigin.Blocket:
        return new BlocketParseStrategy(webScraper);
      case ListingOrigin.Bytbil:
        return new BytbilParseStrategy(BytbilConfig.baseUrl, webScraper);
      case ListingOrigin.Tradera:
        return new TraderaParseStrategy(TraderaConfig.baseUrl, webScraper);
      case ListingOrigin.Sellpy:
        return new SellpyParseStrategy(webScraper);
      case ListingOrigin.Blipp:
        return new BlippParseStrategy(webScraper);
      case ListingOrigin.Shpock:
        return new ShpockParseStrategy(webScraper);
      case ListingOrigin.Kvdbil:
        return new KvdBilParseStrategy(webScraper);
      case ListingOrigin.Citiboard:
        return new CitiboardParseStrategy(webScraper);
      case ListingOrigin.Bilweb:
        return new BilwebParseStrategy(BilwebConfig.baseUrl, webScraper);
      default:
        throw new Error(`No ParseStrategy has been implemented for ${origin}`);
    }
  }

  private createAuthStrategy(origin: ListingOrigin) {
    switch (origin) {
      case ListingOrigin.Blocket:
        return new NextBearerAuthStrategy({
          url: "https://www.blocket.se/",
          tokenJsonPath: "props.initialReduxState.authentication.bearerToken",
        });
      case ListingOrigin.Shpock:
        return new NextAuthInBodyStrategy(
          new FetchTokenFromDocument(
            "https://shpock.com/en-gb/results",
            "props.pageProps.apolloState.ROOT_QUERY['itemSearch({'pagination':{'limit':40},'serializedFilters':'{}','trackingSource':'Search'})'].od"
          ),
          "data.variables.pagination.od"
        );
      default:
        return new NoAuthStrategy();
    }
  }

  private createConfig(origin: ListingOrigin) {
    switch (origin) {
      case ListingOrigin.Blocket:
        return new BlocketConfigs();
      case ListingOrigin.Bytbil:
        return new BytbilConfigs();
      case ListingOrigin.Tradera:
        return new TraderaConfigs();
      case ListingOrigin.Sellpy:
        return new SellpyConfigs();
      case ListingOrigin.Blipp:
        return new BlippConfigs();
      case ListingOrigin.Shpock:
        return new ShpockConfigs();
      case ListingOrigin.Kvdbil:
        return new KvdBilConfigs();
      case ListingOrigin.Citiboard:
        return new CitiboardConfigs();
      case ListingOrigin.Bilweb:
        return new BilwebConfigs();
      default:
        return new WebScraperConfigs([]);
    }
  }

  private createStopStrategy(
    origin: ListingOrigin
  ): IStopScrapeStrategy<Listing[]> {
    switch (origin) {
      case ListingOrigin.Blocket:
        return new StopAtOldListingStrategy(origin);
      default:
        return new NeverStopStrategy();
    }
  }
}
