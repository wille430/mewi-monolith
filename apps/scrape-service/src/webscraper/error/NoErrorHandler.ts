import {IErrorHandler} from "./ErrorHandler";

export class NoErrorHandler implements IErrorHandler<any> {
    isError(obj: any): Promise<boolean> | boolean {
        return false;
    }
}