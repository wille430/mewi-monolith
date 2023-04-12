import { StopAtOldListingStrategy } from "../StopAtOldListingStrategy";
import { ListingOrigin } from "@mewi/models";
import { sample } from "lodash";
import { listingStub } from "../../../tests/stubs/listingStub";

describe(StopAtOldListingStrategy.name, () => {
  let stopStrategy: StopAtOldListingStrategy;

  beforeEach(() => {
    stopStrategy = new StopAtOldListingStrategy(
      sample(Object.values(ListingOrigin))
    );
  });

  describe(StopAtOldListingStrategy.prototype.shouldStop.name, () => {
    describe("when input contains old listing", () => {
      let res: boolean;

      beforeEach(async () => {
        const listing = listingStub({
          date: new Date(),
        });
        await stopStrategy.update([listing]);
        await stopStrategy.stop();
        res = await stopStrategy.shouldStop([listing]);
      });

      it("then it should return true", () => {
        expect(res).toBe(true);
      });
    });

    describe("when input contains new listings", () => {
      let res: boolean;

      beforeEach(async () => {
        const listing = listingStub({
          date: new Date(),
        });
        await stopStrategy.update([listing]);

        listing.date = new Date(Date.now() + 1000);
        res = await stopStrategy.shouldStop([listing]);
      });

      it("then it should return false", () => {
        expect(res).toBe(false);
      });
    });
  });
});