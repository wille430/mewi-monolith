import { AxiosRequestConfig } from "axios";
import { IFetchAuthTokenStrategy } from "./FetchTokenFromDocument";
import { IAuthStrategy } from "./AuthStrategy";
import { set } from "lodash";

export class NextAuthInBodyStrategy implements IAuthStrategy {
  private fetchAuthTokenStrategy: IFetchAuthTokenStrategy;

  private tokenJsonPath: string;

  constructor(
    fetchAuthTokenStrategy: IFetchAuthTokenStrategy,
    tokenJsonPath: string
  ) {
    this.fetchAuthTokenStrategy = fetchAuthTokenStrategy;
    this.tokenJsonPath = tokenJsonPath;
  }

  async addAuth(axiosConfig: AxiosRequestConfig): Promise<void> {
    const token = await this.fetchAuthTokenStrategy.getToken();
    set(axiosConfig, this.tokenJsonPath, token);
  }
}