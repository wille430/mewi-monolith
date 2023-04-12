import { IStopScrapeStrategy } from "../stoppages/StopScrapeStrategy";
import { clone } from "lodash";
import { NeverStopStrategy } from "../stoppages/NeverStopStrategy";

export interface IWebScraperConfig<FetchConfig> {
  getFetchConfig(): FetchConfig;

  getUrl(): string;

  getIdentifier(): string;
}

export class StopStrategyManager<T> {
  private readonly stopStrategies: Record<string, IStopScrapeStrategy<T>> = {};
  private readonly defaultStopStrategy: IStopScrapeStrategy<any>;

  constructor(defaultStopStrategy: IStopScrapeStrategy<any>) {
    this.defaultStopStrategy = defaultStopStrategy;
  }

  public setStopStrategy(
    config: IWebScraperConfig<T>,
    strategy: IStopScrapeStrategy<T> = this.defaultStopStrategy
  ) {
    const id = config.getIdentifier();
    if (Object.keys(this.stopStrategies).length === 0) {
      this.stopStrategies[id] = strategy;
      return;
    }

    if (this.stopStrategies[id] == null) {
      this.stopStrategies[id] = clone(strategy);
    }
  }

  public getStopStrategy(config: IWebScraperConfig<T>): IStopScrapeStrategy<T> {
    const id = config.getIdentifier();
    let stopStrategy = this.stopStrategies[id];

    if (stopStrategy == null) {
      stopStrategy = this.stopStrategies[id] = new NeverStopStrategy();
    }

    return stopStrategy;
  }
}

export class ConfigurationManager<T extends IWebScraperConfig<any>> {
  private selectedConfig: T;
  private readonly configs: T[];

  constructor(configs: T[]) {
    this.configs = configs;
    this.selectedConfig = configs[0];
  }

  public selectConfig(index: number): void {
    if (index < 0 || index >= this.configs.length) {
      throw new Error(`Invalid index provided: ${index}`);
    }
    this.selectedConfig = this.configs[index];
  }

  public currentConfig() {
    if (this.selectedConfig == null) this.selectConfig(0);
    return this.selectedConfig;
  }

  public setConfigById(id: string) {
    for (const config of this.configs) {
      if (config.getIdentifier() === id) {
        this.selectedConfig = config;
        return;
      }
    }

    throw new Error(`No config with id ${id} was found`);
  }

  public getConfigs() {
    return this.configs;
  }
}

export class WebScraperContext<
  T extends IWebScraperConfig<any> = IWebScraperConfig<any>,
  R = any
> {
  private readonly configManager: ConfigurationManager<T>;
  private readonly stopStrategyManager: StopStrategyManager<R>;

  constructor(
    configs: T[],
    stopStrategy: IStopScrapeStrategy<any> = new NeverStopStrategy()
  ) {
    this.configManager = new ConfigurationManager<T>(configs);
    this.stopStrategyManager = new StopStrategyManager(stopStrategy);

    for (const config of configs) {
      this.stopStrategyManager.setStopStrategy(config, stopStrategy);
    }
  }

  public getStopStrategy() {
    return this.stopStrategyManager.getStopStrategy(
      this.configManager.currentConfig()
    );
  }

  public getConfigs(): T[] {
    return this.configManager.getConfigs();
  }

  public getConfig(): T {
    return this.configManager.currentConfig();
  }

  public setConfig(configId: string): IWebScraperConfig<T> {
    this.configManager.setConfigById(configId);
    const config = this.getConfig();
    this.stopStrategyManager.setStopStrategy(config);
    return config;
  }
}
