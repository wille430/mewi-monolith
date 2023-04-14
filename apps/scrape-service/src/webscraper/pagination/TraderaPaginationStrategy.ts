import {IPaginationStrategy} from "./PaginationStrategy";
import axios, {AxiosRequestConfig} from "axios";
import {IPagination} from "@mewi/models";
import get from "lodash/get";
import {max} from "lodash";
import {WebScraper} from "../WebScraper";

export class TraderaPaginationStrategy
    implements IPaginationStrategy<AxiosRequestConfig> {
    private readonly pagings: Record<number, string> = {};
    private static readonly pageLinksJsonPath = "pagination.pageLinks";
    private webScraper: WebScraper<any>;

    constructor(webScraper: WebScraper<any>) {
        this.webScraper = webScraper;
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
        await this.getPagingValuesUpTo(page);
        return this.pagings[page];
    }

    private async getPagingValuesUpTo(page: number): Promise<void> {

        // fetching the first page requires no paging param
        if (page <= 1) {
            return;
        }

        let maxPage: number;
        while ((maxPage = this.getMaxPagingKey(page)) < page) {
            const res = await axios({
                url: this.webScraper.getConfig().getUrl(),
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