import {TraderaPaginationStrategy} from "../TraderaPaginationStrategy";
import {TraderaConfig} from "../../context/TraderaContext";
import {random, sample} from "lodash";
import {expect, describe} from "vitest"

describe("TraderaPaginationStrategy", () => {
    let pagingStrategy: TraderaPaginationStrategy;

    beforeEach(() => {
        const category = sample(TraderaConfig.categories).href;
        pagingStrategy = new TraderaPaginationStrategy(new TraderaConfig(category));
    });

    describe(TraderaPaginationStrategy.prototype.getPagingValue.name, () => {
        it("should return a string", async () => {
            const str = await pagingStrategy.getPagingValue(random(5, 75));
            expect(typeof str === "string").toBeTruthy();
            expect(str.length).toBeGreaterThan(10);
        });
    });
});