import {ConfiguredWebScraper} from "../webscraper/WebScraper";
import {Listing} from "@mewi/entities";
import {ListingOrigin} from "@mewi/models";
import {WebscraperFactory} from "../webscraper/WebscraperFactory";

export class ListingScraperPool {
    private readonly scraperMap: Partial<
        Record<ListingOrigin, ConfiguredWebScraper<Listing>>
    >;
    private readonly webScraperFactory: WebscraperFactory;

    constructor() {
        this.webScraperFactory = new WebscraperFactory();
        this.scraperMap = {};
    }

    getScraper(origin: ListingOrigin): ConfiguredWebScraper<Listing> {
        if (this.scraperMap[origin] == null) {
            this.scraperMap[origin] = this.webScraperFactory.createScraper(origin);
        }

        return this.scraperMap[origin];
    }
}