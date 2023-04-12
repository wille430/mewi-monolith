import {StopAtExistingOriginIdStrategy} from "../StopAtExistingOriginIdStrategy";
import {listingStub} from "../../../tests/stubs/listingStub";

describe(StopAtExistingOriginIdStrategy.name, () => {
    let stopStrategy: StopAtExistingOriginIdStrategy;
    const origin_id = "test-origin-id";

    beforeEach(() => {
        stopStrategy = new StopAtExistingOriginIdStrategy();
    });

    describe(StopAtExistingOriginIdStrategy.prototype.shouldStop.name, () => {
        describe("when a listing has existing origin_id", () => {
            let res: boolean;

            beforeEach(async () => {
                const listing = listingStub({origin_id});
                await stopStrategy.update([listing]);
                res = await stopStrategy.shouldStop([listing]);
            });

            it("then it should return true", () => {
                expect(res).toBe(true);
            });
        });

        describe("when no listing has existing origin_id", () => {
            let res: boolean;

            beforeEach(async () => {
                const listing = listingStub({origin_id});
                await stopStrategy.update([listing]);

                listing.origin_id = origin_id + "2";
                res = await stopStrategy.shouldStop([listing]);
            });

            it("then it should return false", () => {
                expect(res).toBe(false);
            });
        });
    });
});