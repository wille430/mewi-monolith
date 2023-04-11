import {ListingOrigin} from "@mewi/models";
import {createHash} from "crypto";
import {IConversionStrategy} from "./ConversionStrategy";

export class OriginIdConversionStrategy implements IConversionStrategy {
    private readonly origin: ListingOrigin;

    constructor(origin: ListingOrigin) {
        this.origin = origin;
    }

    convert(id: string): string {
        const shasum = createHash("sha1");
        shasum.update(id);

        return `${this.origin}-${shasum.digest("hex")}`;
    }
}