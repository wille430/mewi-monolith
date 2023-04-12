import {IPaginationStrategy} from "./PaginationStrategy";
import axios, {AxiosRequestConfig} from "axios";
import {IPagination} from "@mewi/models";
import {IWebScraperConfig} from "../context/WebScraperContext";
import get from "lodash/get";
import {max} from "lodash";

export class TraderaPaginationStrategy
    implements IPaginationStrategy<AxiosRequestConfig> {
    private readonly pagings: Record<number, string> = {};
    private readonly config: IWebScraperConfig<any>;
    private static readonly pageLinksJsonPath = "pagination.pageLinks";

    constructor(config: IWebScraperConfig<any>) {
        this.config = config;
    }

    public async getPaginationConfig(
        pagination: IPagination
    ): Promise<AxiosRequestConfig> {
        const config: AxiosRequestConfig = {};

        const params = {};

        params["spage"] = pagination.page;
        params["paging"] = await this.getPagingValue(pagination.page);

        config.params = new URLSearchParams(params);

        return config;
    }

    public async getPagingValue(page: number) {
        if (page < 10) {
            return null;
        }
        await this.getPagingValuesUpTo(page);
        return this.pagings[page];
    }

    private async getPagingValuesUpTo(page: number): Promise<void> {
        let maxPage: number;
        while ((maxPage = this.getMaxPagingKey(page)) < page) {
            const res = await axios({
                url: this.config.getUrl(),
                params: {paging: this.pagings[maxPage], spage: maxPage},
            });

            const pageLinks: any[] = get(
                res.data,
                TraderaPaginationStrategy.pageLinksJsonPath
            );

            for (const pageLink of pageLinks) {
                if (pageLink.paging) {
                    this.pagings[pageLink.pageIndex] = pageLink.paging;
                }
            }
        }
    }

    private getMaxPagingKey(lt: number) {
        const pages = Object.keys(this.pagings).map((c) => Number.parseInt(c));
        return max(pages.filter((n) => n <= lt)) ?? -1;
    }
}