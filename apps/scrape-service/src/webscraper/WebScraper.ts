import { IPagination } from "@mewi/models";
import { IFetchStrategy } from "./fetchers/FetchStrategy";
import { IParseStrategy } from "./parsers/ParseStrategy";
import {
  IWebScraperConfig,
  WebScraperConfigs,
} from "./config/WebScraperConfigs";
import { IStopScrapeStrategy } from "./stoppages/StopScrapeStrategy";
import { NeverStopStrategy } from "./stoppages/NeverStopStrategy";

export interface WebScraperResult<T> {
  entities: T;
  shouldContinue: boolean;
}

export class WebScraper<R, T = any, M = Record<any, any>> {
  private fetchStrategy: IFetchStrategy<T>;
  private parseStrategy: IParseStrategy<T, R>;
  private stopScrapeStrategy: IStopScrapeStrategy<R[]>;
  protected config: IWebScraperConfig<any>;

  public async scrape(amount: number): Promise<WebScraperResult<R[]>> {
    const res: WebScraperResult<R[]> = { entities: [], shouldContinue: true };
    let page = 1;
    while (res.shouldContinue !== false && res.entities.length < amount) {
      const { entities, shouldContinue } = await this.scrapePage({ page });
      res.entities.push(...entities);
      res.shouldContinue = res.shouldContinue && shouldContinue;
      page++;
    }

    return {
      ...res,
      entities: res.entities.slice(0, amount),
    };
  }

  public async scrapePage(
    pagination: IPagination
  ): Promise<WebScraperResult<R[]>> {
    if (this.parseStrategy == null)
      throw new Error(`A ParseStrategy has not been initialized`);
    if (this.fetchStrategy == null)
      throw new Error(`A FetchStrategy has not been initialized`);
    if (this.stopScrapeStrategy == null)
      this.stopScrapeStrategy = new NeverStopStrategy();
    // throw new Error(`A StopScrapeStrategy has not been initialized`);

    const objs = await this.fetchStrategy.fetch(pagination);
    const entities = await this.parseStrategy.parseAll(objs.data);

    return {
      entities,
      shouldContinue: await this.stopScrapeStrategy.shouldStop(entities),
    };
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
}

export class ConfiguredWebScraper<
  R,
  T = any,
  M = Record<any, any>
> extends WebScraper<R, T, M> {
  private configs: WebScraperConfigs;

  constructor(configs: WebScraperConfigs) {
    super();
    this.configs = configs;
    this.setInitialConfig();
  }

  private setInitialConfig() {
    this.config = this.configs.currentConfig();
  }

  public nextConfig() {
    this.configs.nextConfig();
    this.config = this.configs.currentConfig();
  }

  public setConfigById(id: string) {
    return this.configs.setConfigById(id);
  }

  public getConfigs() {
    return this.configs.getConfigs();
  }
}
