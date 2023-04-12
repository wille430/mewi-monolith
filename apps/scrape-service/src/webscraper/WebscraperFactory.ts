import { ListingOrigin } from "@mewi/models";
import { WebScraper, WebScraperManager } from "./WebScraper";
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
import { BlocketContext } from "./context/BlocketContext";
import { BytbilConfig, BytbilContext } from "./context/BytbilContext";
import {
  EmptyResultStrategy,
  HasNextPageStrategy,
  LimitIsLessStrategy,
} from "./fetchers/FetchDoneStrategy"
import {IWebScraperConfig, WebScraperContext} from "./context/WebScraperContext"
import { IPaginationStrategy } from "./pagination/PaginationStrategy";
import { IAuthStrategy } from "./auth/AuthStrategy";
import { TraderaParseStrategy } from "./parsers/TraderaParseStrategy";
import { TraderaConfig, TraderaContext } from "./context/TraderaContext";
import { SellpyContext } from "./context/SellpyContext";
import { SellpyParseStrategy } from "./parsers/SellpyParseStrategy";
import { SellpyPaginationStrategy } from "./pagination/SellpyPaginationStrategy";
import { BlippContext } from "./context/BlippContext";
import { BlippParseStrategy } from "./parsers/BlippParseStrategy";
import { BlippPaginationStrategy } from "./pagination/BlippPaginationStrategy";
import { ShpockContext } from "./context/ShpockContext";
import { NextAuthInBodyStrategy } from "./auth/NextAuthInBodyStrategy";
import { FetchTokenFromDocument } from "./auth/FetchTokenFromDocument";
import { ShpockParseStrategy } from "./parsers/ShpockParseStrategy";
import { RequestBodyPaginationStrategy } from "./pagination/RequestBodyPaginationStrategy";
import { KvdBilContext } from "./context/KvdBilContext";
import { KvdBilParseStrategy } from "./parsers/KvdBilParseStrategy";
import { CitiboardContext } from "./context/CitiboardContext";
import { CitiboardParseStrategy } from "./parsers/CitiboardParseStrategy";
import { BilwebConfig, BilwebContext } from "./context/BilwebContext";
import { BilwebParseStrategy } from "./parsers/BilwebParseStrategy";
import { createClassLogger } from "./logging/logger";
import { IFetchStrategy } from "./fetchers/FetchStrategy";
import { AbstractAxiosFetchStrategy } from "./fetchers/AbstractAxiosFetchStrategy";
import {TraderaPaginationStrategy} from "./pagination/TraderaPaginationStrategy"

export class WebscraperFactory {
  public createScraper(origin: ListingOrigin): WebScraperManager<any> {
    const logger = createClassLogger(origin + "Scraper");
    const webScraper = new WebScraper(logger);
    const contextSwitchedWebScraper = new WebScraperManager(
      webScraper,
      this.createConfig(origin)
    );

    const parseStrategy = this.createParseStrategy(origin, webScraper);
    const parseStrategyWrapper = new ListingParseStrategyWrapper(
      parseStrategy,
      origin
    );
    const fetchStrategy = this.createFetchStrategy(origin, webScraper);

    webScraper.setParseStrategy(parseStrategyWrapper);
    webScraper.setFetchStrategy(fetchStrategy);

    return contextSwitchedWebScraper;
  }

  private createPaginationStrategy(origin: ListingOrigin, config: IWebScraperConfig<any>) {
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
        return new TraderaPaginationStrategy(config);
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
      this.createPaginationStrategy(origin, webScraper.getConfig()),
      this.createAuthStrategy(origin),
      // this.createUrlStrategy(origin),
      webScraper,
    ];

    switch (origin) {
      case ListingOrigin.Bytbil:
      case ListingOrigin.Bilweb:
        return new HtmlFetchStrategy(...args).setFetchDoneStrategy((o) =>
          this.createFetchDoneStrategy(origin, o)
        );
      case ListingOrigin.Blocket:
      case ListingOrigin.Tradera:
      case ListingOrigin.Blipp:
      case ListingOrigin.Sellpy:
      case ListingOrigin.Kvdbil:
      case ListingOrigin.Shpock:
      case ListingOrigin.Citiboard:
        return new JsonFetchStrategy(...args).setFetchDoneStrategy((o) =>
          this.createFetchDoneStrategy(origin, o)
        );
      default:
        throw new Error(`No FetchStrategy has been implemented for ${origin}`);
    }
  }

  private createFetchDoneStrategy(
    origin: ListingOrigin,
    fetchStrategy: IFetchStrategy<any>
  ) {
    switch (origin) {
      case ListingOrigin.Blocket:
        if (!(fetchStrategy instanceof AbstractAxiosFetchStrategy))
          throw new Error(
            `${HasNextPageStrategy.name} must be initialized with a FetchStrategy of type ${AbstractAxiosFetchStrategy.name}`
          );
        return new HasNextPageStrategy(fetchStrategy);
      case ListingOrigin.Bilweb:
      case ListingOrigin.Citiboard:
        return new EmptyResultStrategy();
      case ListingOrigin.Tradera:
      case ListingOrigin.Sellpy:
      case ListingOrigin.Blipp:
      case ListingOrigin.Shpock:
      case ListingOrigin.Bytbil:
      case ListingOrigin.Kvdbil:
        return new LimitIsLessStrategy();
      default:
        throw new Error(
          `No FetchDoneStrategy has been implemented for ${origin}`
        );
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
        return new BlocketContext();
      case ListingOrigin.Bytbil:
        return new BytbilContext();
      case ListingOrigin.Tradera:
        return new TraderaContext();
      case ListingOrigin.Sellpy:
        return new SellpyContext();
      case ListingOrigin.Blipp:
        return new BlippContext();
      case ListingOrigin.Shpock:
        return new ShpockContext();
      case ListingOrigin.Kvdbil:
        return new KvdBilContext();
      case ListingOrigin.Citiboard:
        return new CitiboardContext();
      case ListingOrigin.Bilweb:
        return new BilwebContext();
      default:
        return new WebScraperContext([]);
    }
  }
}
