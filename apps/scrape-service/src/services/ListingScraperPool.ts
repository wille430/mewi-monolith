import {Listing} from "@mewi/entities";
import {ListingOrigin} from "@mewi/models";
import {WebscraperFactory} from "../webscraper/WebscraperFactory";
import {WebScraperManager} from "../webscraper/WebScraper";

export class ListingScraperPool {
    private readonly scraperMap: Partial<
        Record<ListingOrigin, WebScraperManager<Listing>>
    >;
    private readonly webScraperFactory: WebscraperFactory;

    constructor() {
        this.webScraperFactory = new WebscraperFactory();
        this.scraperMap = {};
    }

    getScraper(origin: ListingOrigin): WebScraperManager<Listing> {
        if (this.scraperMap[origin] == null) {
            this.scraperMap[origin] = this.webScraperFactory.createScraper(origin);
        }

        return this.scraperMap[origin];
    }
}