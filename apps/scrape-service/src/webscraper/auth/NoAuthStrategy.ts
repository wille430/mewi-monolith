import {AxiosRequestConfig} from "axios";
import {IAuthStrategy} from "./AuthStrategy";

export class NoAuthStrategy implements IAuthStrategy {
    addAuth(config: AxiosRequestConfig): Promise<void> | void {
    }
}