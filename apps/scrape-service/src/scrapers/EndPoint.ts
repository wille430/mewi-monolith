import {ScrapeMetadata, ScrapeReturn} from './Scraper'

interface EndPoint<T> {
    scrape(page: number): Promise<ScrapeReturn<T>>
}

export abstract class AbstractEndPoint<Entity, Response, RawEntity>
    implements EndPoint<Entity> {
    protected identifier: string

    protected constructor(identifier: string) {
        this.identifier = identifier
    }

    async scrape(scrapeAmount: number): Promise<ScrapeReturn<Entity>> {
        const parsedEntities = []

        let entities = []
        let page = 1
        let totalPages = 0
        do {
            const res = await this.getResponse(page)
            const entities = await this.extractEntities(res)
            parsedEntities.push(...await Promise.all(entities.map(this.parseRawEntity.bind(this))))

            totalPages = await this.getScrapeMetadata(res).then(o => o.totalPages)
            page++
        } while (entities.length > 0 && entities.length < scrapeAmount)

        return {
            entities: parsedEntities.slice(0, scrapeAmount) as Entity[],
            metadata: {
                totalPages
            },
        }
    }

    protected abstract getResponse(page: number): Promise<Response>

    protected abstract extractEntities(res: Response): RawEntity[] | Promise<RawEntity[]>

    protected abstract parseRawEntity(obj: RawEntity): Promise<Partial<Entity>> | Partial<Entity>

    protected abstract getScrapeMetadata(res: Response): Promise<ScrapeMetadata>

    public getIdentifier(): string {
        return this.identifier
    }
}