import {AxiosResponse} from "axios";
import {IErrorHandler} from "./ErrorHandler";

export class ShpockErrorHandler implements IErrorHandler<AxiosResponse> {
    isError(obj: AxiosResponse): Promise<boolean> | boolean {
        return obj.data.errors != null;
    }
}