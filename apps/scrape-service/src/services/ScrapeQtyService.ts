import "reflect-metadata"
import {autoInjectable} from "tsyringe";
import {ListingOrigin} from "@mewi/models";
import sum from "lodash/sum";
import {ListingModel} from "@mewi/entities";
import {max} from "lodash";

@autoInjectable()
export class ScrapeQtyService {
    public static TOTAL_SCRAPE_QUANTITY = 10000;
    public static MIN_SCRAPE_QUANTITY = 40;
    private originToFractionMap: Record<ListingOrigin, number> | null;

    private async getWeights() {
        const agg = await ListingModel.aggregate([
            {
                $match: {
                    // get 1-week-old or newer listings
                    date: {$gte: new Date(Date.now() - 7 * 60 * 60 * 24 * 1000)},
                },
            },
            {
                $group: {
                    _id: {origin: "$origin"},
                    count: {$sum: 1},
                },
            },
        ]);

        const totalCount = sum(agg.map((x) => x.count));

        this.originToFractionMap = {} as any;
        for (const res of agg) {
            const origin = res._id.origin as ListingOrigin;
            this.originToFractionMap[origin] = res.count / totalCount;
        }
    }

    public async getScrapeQuantity(origin: ListingOrigin) {
        if (this.originToFractionMap == null) {
            await this.getWeights();
        }

        return max([
            (this.originToFractionMap[origin] ?? 0) * ScrapeQtyService.TOTAL_SCRAPE_QUANTITY,
            ScrapeQtyService.MIN_SCRAPE_QUANTITY,
        ]);
    }
}
