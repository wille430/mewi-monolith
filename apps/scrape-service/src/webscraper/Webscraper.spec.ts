import { beforeAll, expect } from "vitest";
import { WebScraper } from "./WebScraper";
import { WebscraperFactory } from "./WebscraperFactory";
import { ListingDto, ListingOrigin } from "@mewi/models";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import { ListingValidator } from "../models/ListingValidator";

describe("WebScrapers", () => {
  describe.each(Object.values(ListingOrigin))("%s", (origin) => {
    let factory: WebscraperFactory;
    let scraper: WebScraper<any>;

    beforeAll(() => {
      factory = new WebscraperFactory();
      scraper = factory.createScraper(origin).getScraper();
    });

    describe("#hasMore", () => {
      let ret: boolean;

      beforeEach(async () => {
        ret = await scraper.hasMore();
      })

      it("should return boolean", () => {
        expect(ret).toBe(true);
      })
    })

    describe("#scrape", () => {
      let entities: ListingDto[];

      beforeEach(async () => {
        const res = await scraper.scrapePage({
          page: 1,
          limit: 20,
        });
        entities = res.entities;
      });

      it("should return listings", async () => {
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

          if (listing.imageUrl.length == 0) hasNoImage++;
        }
        expect(invalidListings).toBe(0);
        // Some listings must at least have an image
        expect(hasNoImage).toBeLessThan(entities.length);
      });
    });
  });
});