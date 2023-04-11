import { AxiosRequestConfig } from "axios";

export interface IAuthStrategy {
  addAuth(config: AxiosRequestConfig): Promise<void> | void;
}
