import {IPagination, ISortable, ListingSort} from "@mewi/models";
import {FindAllListingsDto} from "@mewi/models/dist/FindAllListingsDto";
import * as process from "process";
import * as winston from "winston";
import {prettyStringify} from "@mewi/utilities";

export class FilteringService {
    private static readonly sortToSortObjMap: Record<ListingSort, any> = {
        [ListingSort.DATE_ASC]: {
            date: 1,
        },
        [ListingSort.DATE_DESC]: {
            date: -1,
        },
        [ListingSort.PRICE_ASC]: {
            "price.value": 1,
        },
        [ListingSort.PRICE_DESC]: {
            "price.value": -1,
        },
        [ListingSort.RELEVANCE]: undefined,
    };
    private readonly MIN_SEARCH_SCORE = 1;
    private readonly logger: winston.Logger | null;

    constructor(logger: winston.Logger | null = null) {
        this.logger = logger;
    }

    public applySort(obj: ISortable, pipeline: any[]): void {
        if (obj.sort) {
            pipeline.push({
                $sort: obj.sort,
            });
        }
    }

    public applyPagination(obj: IPagination, pipeline: any[]): void {
        if (obj.limit != null) {
            pipeline.push({
                $skip: ((obj.page ?? 1) - 1) * obj.limit,
            });
            pipeline.push({
                $limit: obj.limit,
            });
        }
    }

    public convertToPipeline(dto: Partial<FindAllListingsDto>): any[] {
        const pipeline: any[] = [];

        this.applyFieldsFilter(dto, pipeline);

        if (dto.sort) {
            this.applySort(
                {
                    sort: FilteringService.sortToSortObjMap[dto.sort],
                },
                pipeline
            );
        } else if (!dto.keyword) {
            // capping results to reduce number of documents sorted because of
            // memory issue
            pipeline.push({
                $limit: 20000,
            });
            this.applySort(
                {
                    sort: FilteringService.sortToSortObjMap[ListingSort.DATE_DESC],
                },
                pipeline
            );
        }

        this.applyPagination(dto, pipeline);

        this.logger.info(
            `filters (${prettyStringify(dto)}) resulted in (${prettyStringify(
                pipeline
            )})`
        );
        return pipeline;
    }

    private applyFieldsFilter(dto: Partial<FindAllListingsDto>, pipeline: any[]) {
        for (const kv of Object.entries(dto)) {
            const [key, value] = kv;
            this.logger.info(`Applying filter ${key}=${value}`);
            this.applyFieldFilter(key, value, pipeline);
        }
    }

    private applyFieldFilter(field: string, value: any, pipeline: any[]) {
        if (!value) return;

        switch (field) {
            case "keyword":
                pipeline.unshift(
                    process.env.NODE_ENV === "development"
                        ? {
                            $match: {
                                keyword: {
                                    $regex: new RegExp(value, "i"),
                                },
                            },
                        }
                        : {
                            $search: {
                                index: "listing_search_prod",
                                text: {
                                    query: value as string,
                                    path: {
                                        wildcard: "*",
                                    },
                                    fuzzy: {},
                                },
                            },
                        },
                    {
                        $addFields: {
                            score: {$meta: "searchScore"},
                        },
                    },
                    {$match: {score: {$gte: this.MIN_SEARCH_SCORE}}}
                );
                break;
            case "auction":
                pipeline.push({$match: {auction: value}});
                break;
            case "categories":
                pipeline.push({$match: {category: {$in: value}}});
                break;
            case "dateGte":
                pipeline.push({
                    $match: {
                        date: {
                            $gte: new Date(value),
                        },
                    },
                });
                break;
            case "priceRangeGte":
                pipeline.push({$match: {"price.value": {$gte: value}}});
                break;
            case "priceRangeLte":
                pipeline.push({$match: {"price.value": {$lte: value}}});
                break;
            case "region":
                const regions = value
                    .split(/([., ])? /i)
                    .filter((x: string) => !!x && !new RegExp(/^,$/).test(x))
                    .map((x: string) => x.trim());

                pipeline.push({
                    $match: {
                        region: {
                            $regex: (`^` +
                                regions.map((reg: any) => "(?=.*\\b" + reg + "\\b)").join("") +
                                ".+") as any,
                            $options: "i",
                        },
                    },
                });
                break;
            case "origins":
                pipeline.push({$match: {origin: {$in: value}}});
                break;
            default:
                break;
        }
    }
}
