import assert from "assert";
import { AxiosRequestConfig } from "axios";
import { IAuthStrategy } from "./AuthStrategy";
import {
  FetchTokenFromDocument,
  IFetchAuthTokenStrategy,
} from "./FetchTokenFromDocument";

export interface NextBearerAuthStrategyConfig {
  tokenJsonPath: string;
  bearerPrefix: string;
  nextDataSelector: string;
  url: string;
  authHeaderProp: string;
}

export class NextBearerAuthStrategy implements IAuthStrategy {
  private config: NextBearerAuthStrategyConfig;
  private static defaultConfig: NextBearerAuthStrategyConfig = {
    nextDataSelector: "#__NEXT_DATA__",
    tokenJsonPath: null,
    url: null,
    authHeaderProp: "Authorization",
    bearerPrefix: "Bearer",
  };

  private fetchAuthTokenStrategy: IFetchAuthTokenStrategy;

  constructor(config: Partial<NextBearerAuthStrategyConfig>) {
    this.setConfig(config);

    this.fetchAuthTokenStrategy = new FetchTokenFromDocument(
      this.config.url,
      this.config.tokenJsonPath,
      this.config.nextDataSelector
    );
  }

  private setConfig(config: Partial<NextBearerAuthStrategyConfig>) {
    assert(config.tokenJsonPath);
    assert(config.url);
    this.config = Object.assign(NextBearerAuthStrategy.defaultConfig, config);
  }

  public async addAuth(axiosConfig: AxiosRequestConfig): Promise<void> {
    axiosConfig.headers = Object.assign(axiosConfig.headers ?? {}, {
      [this.config.authHeaderProp]: `${
        this.config.bearerPrefix
      } ${await this.fetchAuthTokenStrategy.getToken()}`,
    });
  }
}
