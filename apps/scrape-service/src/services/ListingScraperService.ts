import {Listing, ListingModel} from "@mewi/entities";
import {
    RunScrapeDto,
    ScrapeAllArgs,
    ScrapeByIdArgs,
    ScrapeByOriginArgs,
} from "@mewi/mqlib";
import {ListingOrigin} from "@mewi/models";
import {floor, max} from "lodash";
import {ScrapeQtyService} from "./ScrapeQtyService";
import {autoInjectable, inject} from "tsyringe";
import {ListingScraperPool} from "./ListingScraperPool";
import {WebScraperManager} from "../webscraper/WebScraper";

@autoInjectable()
export class ListingScraperService {
    // 14 days
    private DELETE_OLDER_THAN = 14 * 24 * 60 * 60 * 1000;

    private readonly scraperPool: ListingScraperPool;

    constructor(
        @inject(ScrapeQtyService)
        private readonly scrapeQtyService: ScrapeQtyService
    ) {
        this.scraperPool = new ListingScraperPool();
    }

    async scrape(args: RunScrapeDto) {
        const {origin, endpoint, scrapeAmount} = args;
        if (origin != null && !Object.values(ListingOrigin).includes(origin))
            throw new Error(`${origin} is not a valid origin`);

        if (
            scrapeAmount != null &&
            (!Number.isInteger(scrapeAmount) || scrapeAmount < 0)
        )
            throw new Error(`scrapeAmount must be a valid number`);

        if (origin == null && endpoint == null) {
            if (scrapeAmount == null) {
                throw new Error("scrapeAmount must be a non-null number");
            }

            return this.scrapeAll({scrapeAmount});
        }

        if (endpoint == null) {
            return this.scrapeByOrigin({
                scrapeAmount,
                origin,
            });
        }

        if (typeof endpoint != "string")
            throw Error(`endpoint must be a non-null string`);
        await this.scrapeById({scrapeAmount, origin, configId: endpoint});
    }

    private async scrapeByOrigin(args: ScrapeByOriginArgs) {
        const {scrapeAmount: _scrapeAmount, origin} = args;
        const context = this.getContextSwitchScraper(origin);
        const configs = context.getConfigs();
        let scrapeAmount = _scrapeAmount;

        if (scrapeAmount == null) {
            scrapeAmount = await this.scrapeQtyService.getScrapeQuantity(origin);
        }
        const scrapeAmountEndpoint = max([floor(scrapeAmount / configs.length), 1]);

        console.log(`Scraping ${scrapeAmount} listings from ${origin}...`);

        const scraper = context.getScraper();
        const listings = [];
        for (const config of configs) {
            try {
                context.setConfig(config.getIdentifier());
                const {entities} = await scraper.scrape(scrapeAmountEndpoint);
                listings.push(...entities);
            } catch (e) {
                console.error(e);
            }
        }

        console.log(
            `Successfully scraped ${listings.length} listings from ${origin}`
        );
        await this.createListings(listings);
    }

    private async scrapeById(args: ScrapeByIdArgs) {
        const {origin, configId, scrapeAmount: _scrapeAmount} = args;

        let scrapeAmount = _scrapeAmount;
        if (scrapeAmount == null) {
            scrapeAmount = await this.scrapeQtyService.getScrapeQuantity(origin);
        }

        console.log(
            `Scraping ${scrapeAmount} listings from ${origin} (${configId})...`
        );

        // run scraper
        const context = this.getContextSwitchScraper(origin);
        const scraper = context.getScraper();

        try {
            context.setConfig(configId);
        } catch (e) {
            console.log(e);
            return;
        }

        const {entities} = await scraper.scrape(scrapeAmount);
        await this.createListings(entities);

        console.log(
            `Successfully scraped ${entities.length} listings from ${origin}`
        );
    }

    private async createListings(entities) {
        // remove old
        await this.removeOld();
        // remove already existing listings with same origin id
        await this.removeListings(entities.map(({origin_id}) => origin_id));
        await ListingModel.create(entities);
    }

    private async scrapeAll(args: ScrapeAllArgs) {
        const start = Date.now();
        const {scrapeAmount} = args;

        const scrapeAmountScraper = floor(
            scrapeAmount / Object.keys(ListingOrigin).length
        );
        console.log(
            `Scraping ${scrapeAmount} listings from all endpoints (${scrapeAmountScraper} from each website)...`
        );

        for (const origin of Object.values(ListingOrigin)) {
            const context = this.getContextSwitchScraper(origin);
            const scraper = context.getScraper();
            const configs = context.getConfigs();

            const scrapeAmountEndpoint = scrapeAmountScraper / configs.length;
            const listings = [];

            for (const config of configs) {
                try {
                    scraper.setConfig(config);
                    const {entities} = await scraper.scrape(scrapeAmountEndpoint);
                    listings.push(...entities);
                } catch (e) {
                    console.error(e);
                }
            }
            await this.createListings(listings);
        }

        console.log(
            `Finished scraping all endpoints. It took ${(Date.now() - start) / 1000}s`
        );
    }

    private async removeListings(ids: string[]) {
        return ListingModel.deleteMany({
            origin_id: {
                $in: ids,
            },
        });
    }

    private async removeOld() {
        return ListingModel.deleteMany({
            createdAt: {
                $lt: new Date(Date.now() - this.DELETE_OLDER_THAN).toISOString(),
            },
        });
    }

    private getContextSwitchScraper(
        origin: ListingOrigin
    ): WebScraperManager<Listing> {
        return this.scraperPool.getScraper(origin);
    }
}
