import { beforeAll, expect } from "vitest";
import { WebScraper } from "./WebScraper";
import { WebScraperFactory } from "./factories/WebScraperFactory";
import { ListingDto, ListingOrigin } from "@mewi/models";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ListingValidator } from "../models/ListingValidator";

describe("WebScrapers", () => {
  describe.each(Object.values(ListingOrigin))("%s", (origin) => {
    let factory: WebScraperFactory;
    let scraper: WebScraper<any>;

    beforeAll(() => {
      factory = new WebScraperFactory();
      scraper = factory.createScraper(origin).getScraper();
    });

    describe("#hasMore", () => {
      let ret: boolean;

      beforeEach(async () => {
        ret = await scraper.hasMore();
      });

      it("should return boolean", () => {
        expect(ret).toBe(true);
      });
    });

    describe("#scrape", () => {
      it("should return listings", async () => {
        const res = await scraper.scrapePage({
          page: 1,
          limit: 20,
        });
        const entities = res.entities;

        expect(entities).toBeInstanceOf(Array);
        expect(entities.length).toBeGreaterThan(1);

        let invalidListings = 0;
        let hasNoImage = 0;
        for (const listing of entities) {
          const err = await validate(
            plainToInstance(ListingValidator, listing)
          );
          if (err.length) {
            console.error(err);
            invalidListings++;
          }

          if (listing.imageUrl.length === 0) {
            hasNoImage++;
          }
        }
        expect(invalidListings).toBe(0);
        // Some listings must at least have an image
        expect(hasNoImage).toBeLessThan(entities.length);
      });

      it(
        "should return different listings on pagination",
        async () => {
          // Scraping page 2 before page 1 to not get duplicates
          const secondPage = await scraper.scrapePage({
            page: 2,
            limit: 20,
          });
          const firstPage = await scraper.scrapePage({
            page: 1,
            limit: 20,
          });

          const sameListing: ListingDto[] = firstPage.entities.filter(
            (l1) =>
              secondPage.entities.find((l2) => l2.origin_id === l1.origin_id) !=
              null
          );

          expect(sameListing.length).toBeLessThanOrEqual(
            secondPage.entities.length / 2
          );
        },
        {
          timeout: 30000,
        }
      );
    });
  });
});
