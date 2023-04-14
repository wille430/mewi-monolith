import { TraderaPaginationStrategy } from "../TraderaPaginationStrategy";
import { TraderaConfig } from "../../context/TraderaContext";
import { range, sample } from "lodash";
import { describe, expect } from "vitest";
import { WebScraperFactory } from "../../factories/WebScraperFactory";
import { ListingOrigin } from "@mewi/models";

describe("TraderaPaginationStrategy", () => {
  let pagingStrategy: TraderaPaginationStrategy;

  beforeEach(() => {
    const category = sample(TraderaConfig.categories).href;
    const webScraper = new WebScraperFactory().createScraper(
      ListingOrigin.Tradera
    );
    webScraper.setConfig(category);
    pagingStrategy = new TraderaPaginationStrategy(webScraper.getScraper());
  });

  describe(TraderaPaginationStrategy.prototype.getPagingValue.name, () => {
    it.each(range(2, 20, 3))(
      "should return a string for page > 1",
      async (n) => {
        const str = await pagingStrategy.getPagingValue(n);
        expect(typeof str === "string").toBeTruthy();
        expect(str.length).toBeGreaterThan(10);
      }
    );

    it("should return null if page is 1 or less", async () => {
      const str = await pagingStrategy.getPagingValue(0);
      expect(str).not.toBeTruthy();
    });
  });
});