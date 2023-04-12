import { IPagination } from "@mewi/models";
import { IFetchStrategy } from "./fetchers/FetchStrategy";
import { IParseStrategy } from "./parsers/ParseStrategy";
import {
  IWebScraperConfig,
  WebScraperContext,
} from "./context/WebScraperContext";
import { IStopScrapeStrategy } from "./stoppages/StopScrapeStrategy";
import { NeverStopStrategy } from "./stoppages/NeverStopStrategy";
import { createLogger, Logger, transports } from "winston";

export interface WebScraperResult<T> {
  entities: T;
  shouldContinue: boolean;
}

export class WebScraper<R, T = any, M = Record<any, any>> {
  private fetchStrategy: IFetchStrategy<T>;
  private parseStrategy: IParseStrategy<T, R>;
  private stopScrapeStrategy: IStopScrapeStrategy<R[]>;
  protected config: IWebScraperConfig<any>;

  private readonly logger: Logger;

  constructor(logger: Logger = null) {
    this.logger = logger;

    if (this.logger == null) {
      this.logger = createLogger({
        transports: [new transports.Console()],
      });
    }
  }

  public async scrape(amount: number): Promise<WebScraperResult<R[]>> {
    const res: WebScraperResult<R[]> = { entities: [], shouldContinue: true };
    let page = 1;

    await this.stopScrapeStrategy.start();

    while (res.shouldContinue !== false && res.entities.length < amount) {
      const { entities, shouldContinue } = await this.scrapePage({ page });
      res.entities.push(...entities);
      res.shouldContinue = res.shouldContinue && shouldContinue;
      page++;

      this.logger.log(
        "info",
        `${
          res.entities.length
        }/${amount} entities scraped from ${this.config.getUrl()}`
      );
    }

    await this.stopScrapeStrategy.stop();

    this.logger.log("info", this.stopScrapeStrategy.getStatusMsg());

    return {
      ...res,
      entities: res.entities.slice(0, amount),
    };
  }

  public async scrapePage(
    pagination: IPagination
  ): Promise<WebScraperResult<R[]>> {
    this.validateInitialization();

    const objs = await this.fetchStrategy.fetch(pagination);

    this.logger.log(
      "info",
      `Fetched ${
        objs.data.length
      } objects from ${this.config.getUrl()} at page ${pagination.page} with config ${this.config.getIdentifier()}`
    );

    let entities = await this.parseStrategy.parseAll(objs.data);

    await this.stopScrapeStrategy.update(entities);

    const shouldStop = await this.stopScrapeStrategy.shouldStop(entities);
    const stopAtIndex = await this.stopScrapeStrategy.indexOfFirstInvalid(
      entities
    );

    if (stopAtIndex >= 0) {
      entities = entities.slice(0, stopAtIndex);
    }

    if (shouldStop) {
      if (stopAtIndex < 0) {
        this.logger.log("info", `Reached stop. Stopping scraping...`);
      } else {
        this.logger.log(
          "info",
          `Reached stop. Stopping scraping with ${entities.length} remaining entities...`
        );
      }
    }

    return {
      entities,
      shouldContinue: !shouldStop,
    };
  }

  /**
   * Returns true if there are more to scrape
   */
  public async hasMore(): Promise<boolean> {
    this.validateInitialization();

    const { data, done } = await this.fetchStrategy.fetch({
      page: 1,
      limit: 1,
    });
    const entity = await this.parseStrategy.parse(data[0]);

    return !(await this.stopScrapeStrategy.shouldStop([entity])) || done;
  }

  public setParseStrategy(parseStrategy: IParseStrategy<T, R>) {
    this.parseStrategy = parseStrategy;
  }

  public setFetchStrategy(fetchStrategy: IFetchStrategy<T>) {
    this.fetchStrategy = fetchStrategy;
  }

  public setStopScrapeStrategy(stopScrapeStrategy: IStopScrapeStrategy<R[]>) {
    this.stopScrapeStrategy = stopScrapeStrategy;
  }

  public setConfig(webScraperConfig: IWebScraperConfig<any>) {
    this.config = webScraperConfig;
  }

  public getConfig() {
    return this.config;
  }

  private validateInitialization() {
    if (this.parseStrategy == null)
      throw new Error(`A ParseStrategy has not been initialized`);
    if (this.fetchStrategy == null)
      throw new Error(`A FetchStrategy has not been initialized`);
    if (this.stopScrapeStrategy == null)
      this.stopScrapeStrategy = new NeverStopStrategy();
  }
}

export class WebScraperManager<R, T = any, M = Record<any, any>> {
  private readonly webScraper: WebScraper<R, T, M>;
  private readonly context: WebScraperContext;

  constructor(webScraper: WebScraper<R, T, M>, context: WebScraperContext) {
    this.webScraper = webScraper;
    this.context = context;

    this.updateWebScraper();
  }

  public getScraper() {
    return this.webScraper;
  }

  public getConfigs() {
    return this.context.getConfigs();
  }

  public setConfig(configId: string) {
    this.context.setConfig(configId);
    this.updateWebScraper();
  }

  private updateWebScraper() {
    const config = this.context.getConfig();

    this.webScraper.setConfig(config);
    this.webScraper.setStopScrapeStrategy(this.context.getStopStrategy());
  }
}
