import {AbstractEndPoint} from './EndPoint'
import {ListingOrigin} from "@mewi/models"

export type ScrapeResponse<T> = {
    entities: T[]
    metadata: ScrapeMetadata
}

export type ScrapeMetadata = {
    totalPages?: number
}

export abstract class Scraper<Entity> {
    private origin: ListingOrigin
    private baseUrl: string
    private endPoints: AbstractEndPoint<Entity, any, any>[]

    protected constructor(origin: ListingOrigin, baseUrl: string, endPoints: AbstractEndPoint<Entity, any, any>[]) {
        this.origin = origin
        this.baseUrl = baseUrl
        this.endPoints = endPoints
    }

    public scrapeEndpoint(endpointStr: string, scrapeAmount: number) {
        const endPoint = this.endPoints.find(e => e.getIdentifier() === endpointStr)
        if (endPoint == null) throw new Error(`Could not find endpoint with identifier "${endpointStr}". 
                                                Valid values are ${this.endPoints.map(e => e.getIdentifier()).join(", ")}`)
        return endPoint.scrape(scrapeAmount)
    }

    public getEndpoints(): AbstractEndPoint<Entity, any, any>[] {
        return this.endPoints
    }
}
