import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import axios from 'axios'
import { Inject } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { EntryPoint } from './EntryPoint'
import type { CreateConfigFunction } from './types/CreateConfigFunction'
import { BaseListingScraper } from './BaseListingScraper'
import type { ScrapedListing } from './types/ScrapedListing'
import type { ScrapeContext } from './types/ScrapeContext'
import { ScrapingLogsRepository } from '../scraping-logs.repository'
import { ListingsRepository } from '@/listings/listings.repository'

export abstract class ListingScraper extends BaseListingScraper {
    entryPoints: EntryPoint[] = []

    constructor(
        @Inject(ListingsRepository) readonly listingsRepository: ListingsRepository,
        @Inject(ScrapingLogsRepository) readonly scrapingLogsRepository: ScrapingLogsRepository,
        @Inject(ConfigService) readonly config: ConfigService
    ) {
        super()
        this.parseRawListing = this.parseRawListing.bind(this)
    }

    readonly defaultAxiosRequestConfig: AxiosRequestConfig = {
        withCredentials: true,
    }

    async createAxiosInstance(): Promise<AxiosInstance> {
        return axios.create()
    }

    /**
     * Override this function to find the array of unparsed listings
     *
     * @param res - Axios Response object
     * @returns An array of objects of unknown shape
     */
    extractRawListingsArray(res: AxiosResponse<any, any>) {
        return res.data as any
    }
    async parseRawListing(
        obj: Record<string, any>,
        context: ScrapeContext
    ): Promise<ScrapedListing> {
        return obj as any
    }

    createEntryPoint(createConfig: CreateConfigFunction, identifier?: string) {
        this.entryPoints.push(
            new EntryPoint(
                this.listingsRepository,
                this.scrapingLogsRepository,
                this,
                createConfig,
                identifier ?? this.origin
            )
        )
    }
}
