import { ListingOrigin } from '@/common/schemas'
import constant from 'lodash/constant'
import { ScrapeOptions } from '../classes/types/ScrapeOptions'
import { AbstractEndPoint } from './EndPoint'

export type ScrapeReturn<T> = {
    entities: T[]
    metadata: ScrapeMetadata
}

export type ScrapeMetadata = {
    totalPages?: number
}

export type ScrapeAllReturn<T> = ScrapeReturn<T> & {
    shouldContinue: boolean
}

export abstract class Scraper<Entity> {
    // TODO: origin should not be here
    origin: ListingOrigin
    baseUrl: string
    endPoints: AbstractEndPoint<Entity>[]

    constructor(origin: ListingOrigin, baseUrl: string, endPoints: AbstractEndPoint<Entity>[]) {
        this.origin = origin
        this.baseUrl = baseUrl
        this.endPoints = endPoints
    }

    *pages(options: ScrapeOptions) {
        for (const endPoint of this.endPoints) {
            for (const page of endPoint.pages(options)) {
                let p = 1
                // eslint-disable-next-line no-async-promise-executor
                yield new Promise<ScrapeAllReturn<Entity>>(async (resolve) => {
                    const res = await page

                    resolve({
                        ...res,
                        shouldContinue: this.shouldContinue(res.entities, res.metadata, p, options),
                    } as ScrapeAllReturn<Entity>)
                })
                p++
            }
        }
    }

    private shouldContinue(
        entities: Entity[],
        metadata: ScrapeMetadata,
        page: number,
        options: ScrapeOptions
    ): boolean {
        const { stopAtPredicate, scrapeAmount } = options

        return (
            entities.find(stopAtPredicate ?? constant(false)) == null ||
            (scrapeAmount != null && entities.length >= scrapeAmount) ||
            (metadata.totalPages != null && metadata.totalPages >= page)
        )
    }
}
