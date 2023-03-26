import { ScrapeQtyService } from "./ScrapeQtyService";
import { ListingOrigin } from "@mewi/models";
import { ListingModel } from "@mewi/entities";
import { expect, vi } from "vitest";

describe("ScrapeQtyService", () => {
  let scrapeQtyService: ScrapeQtyService;
  beforeEach(async () => {
    scrapeQtyService = new ScrapeQtyService();
  });

  describe("#getScrapeQuantity", () => {
    let res: number;

    beforeEach(async () => {
      ListingModel.aggregate = vi.fn().mockResolvedValue([
        { _id: { origin: ListingOrigin.Tradera }, count: 20 },
        { _id: { origin: ListingOrigin.Blocket }, count: 20 },
      ]);

      res = await scrapeQtyService.getScrapeQuantity(ListingOrigin.Tradera);
    });

    it("should return a valid decimal number", () => {
      expect(res).toBeGreaterThan(ScrapeQtyService.MIN_SCRAPE_QUANTITY);
      expect(res).toBeLessThan(ScrapeQtyService.TOTAL_SCRAPE_QUANTITY);

      expect(res).toBe(ScrapeQtyService.TOTAL_SCRAPE_QUANTITY / 2);
    });
  });
});
