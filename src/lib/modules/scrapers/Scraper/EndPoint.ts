import { ScrapeOptions } from '../ScrapeOptions'
import { BrowserService } from './BrowserService'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse } from 'axios'
import flow from 'lodash/flow'
import { ScrapeMetadata, ScrapeReturn } from './Scraper'
import { Selectors } from './Selectors'
import { ScrapePagination } from './interface/scrape-pagination.inteface'
import { load } from 'cheerio'
import type { CheerioAPI, Cheerio } from 'cheerio'

interface EndPoint<T> {
    scrape(pagination: ScrapePagination, options: ScrapeOptions): Promise<ScrapeReturn<T>>
}

export abstract class AbstractEndPoint<Entity, Response = any, RawEntity = any>
    implements EndPoint<Entity>
{
    protected identifier: string

    constructor(identifier: string) {
        this.identifier = identifier
    }

    async scrape(
        pagination: ScrapePagination = {},
        options: ScrapeOptions = {}
    ): Promise<ScrapeReturn<Entity>> {
        const res = await this.getResponse(pagination, options)

        const entities = await this.extractEntities(res)
        const parsedEntities = await Promise.all(entities.map((o) => this.parseRawEntity(o)))

        const metadata = await this.getScrapeMetadata(res)

        return {
            entities: parsedEntities as Entity[],
            metadata,
        }
    }

    *pages(options: ScrapeOptions) {
        let i = 0
        while (1) {
            yield this.scrape(
                {
                    page: i + 1,
                },
                options
            )
            i++
        }
    }

    protected abstract getResponse(
        pagination: ScrapePagination,
        options: ScrapeOptions
    ): Promise<Response>

    protected abstract extractEntities(res: Response): RawEntity[] | Promise<RawEntity[]>

    protected abstract parseRawEntity(obj: RawEntity): Promise<Partial<Entity>> | Partial<Entity>

    protected abstract getScrapeMetadata(res: Response): Promise<ScrapeMetadata>

    getIdentifier(): string {
        return this.identifier
    }
}

export type ConfigMiddleware = <T>(config: AxiosRequestConfig<T>) => Promise<AxiosRequestConfig<T>>

export abstract class ApiEndPoint<T> extends AbstractEndPoint<T, AxiosResponse> {
    protected abstract configMiddlewares: ConfigMiddleware[]

    protected async getResponse(
        pagination: ScrapePagination,
        options: ScrapeOptions
    ): Promise<AxiosResponse<any, any>> {
        const applyMiddlewares = flow(...this.configMiddlewares)
        const config = await applyMiddlewares(await this.createAxiosConfig(pagination, options))
        return axios(config)
    }

    protected abstract createAxiosConfig(
        pagination: ScrapePagination,
        options: ScrapeOptions
    ): Promise<AxiosRequestConfig>
}

export abstract class EndPointDOM<T> extends AbstractEndPoint<T, CheerioAPI, Cheerio<any>> {
    private selectors: Selectors<T>

    constructor(identifier: string, selectors: Selectors<T>) {
        super(identifier)
        this.selectors = selectors
    }

    protected abstract createUrl(pagination: ScrapePagination, options: ScrapeOptions): string

    protected async getResponse(
        pagination: ScrapePagination,
        options: ScrapeOptions
    ): Promise<CheerioAPI> {
        const { data: html } = await axios.get(this.createUrl(pagination, options))
        const $ = load(html)

        return $
    }

    protected async extractEntities($: CheerioAPI): Promise<Cheerio<any>[]> {
        const nodes = await this.selectors.getListElements($)

        return nodes.map((node) => $(node))
    }
}

export abstract class NextEndPoint<T> extends ApiEndPoint<T> {
    private browserService: BrowserService
    private tokenUrl: string

    constructor(tokenUrl: string, identifier: string) {
        super(identifier)

        this.browserService = new BrowserService()
        this.tokenUrl = tokenUrl
    }

    async getNextData(): Promise<Record<any, any>> {
        try {
            const page = await this.browserService.getPage(this.tokenUrl)

            return await page.evaluate(() => {
                const nextDataSelector = '#__NEXT_DATA__'
                const text = document.querySelector(nextDataSelector)?.textContent

                if (text == null) {
                    throw new Error(
                        `Could not scrape token from ${document.location.href}. Selector ${nextDataSelector} might be missing`
                    )
                }

                const json: Record<any, any> = JSON.parse(text)

                return json
            })
        } finally {
            await this.browserService.close()
        }
    }
}

export abstract class NextEndPointWithBuildId<T> extends NextEndPoint<T> {
    private buildId?: string
    protected configMiddlewares = [this.addBuildId.bind(this)]

    async addBuildId(config: AxiosRequestConfig<any>): Promise<AxiosRequestConfig<any>> {
        return {
            ...config,
            headers: {
                ...config.headers,
                Authorization: `Bearer ${await this.getBuildId()}`,
            },
        }
    }

    async getBuildId() {
        if (this.buildId) {
            return this.buildId
        }

        const nextData = await this.getNextData()
        const token = nextData.buildId

        this.buildId = token
        return this.buildId
    }
}
