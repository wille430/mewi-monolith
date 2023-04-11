export interface IWebScraperConfig<FetchConfig> {
  getFetchConfig(): FetchConfig;

  getUrl(): string;

  getIdentifier(): string;
}

export class WebScraperConfigs<
  T extends IWebScraperConfig<any> = IWebScraperConfig<any>
> {
  private configs: T[];
  private selected: T;

  constructor(configs: T[]) {
    this.configs = configs;
    this.selected = configs[0];
  }

  public getConfigs(): T[] {
    return this.configs;
  }

  public nextConfig(): void {
    this.selected = this.configs[this.configs.indexOf(this.selected) + 1];
  }

  public selectConfig(i: number): void {
    this.selected = this.configs[i];
  }

  public currentConfig() {
    if (this.selected == null) this.selectConfig(0);
    return this.selected;
  }

  public setConfigById(id: string) {
    for (const config of this.configs) {
      if (config.getIdentifier() === id) {
        this.selected = config;
        return;
      }
    }

    throw new Error(`No config with id ${id} was found`);
  }
}
