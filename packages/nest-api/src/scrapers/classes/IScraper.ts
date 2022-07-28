import { ScraperStatus } from '@wille430/common'
import { AxiosInstance } from 'axios'

export interface IScraper<T> {
    readonly defaultScrapeUrl: string | Promise<string>
    readonly baseUrl: string

    status: ScraperStatus
    client: AxiosInstance
    useRobots: boolean

    getBatch(): Promise<T[]>
    start(): void
    addAuthentication(axios: AxiosInstance): Promise<AxiosInstance> | AxiosInstance
    allowsScraping(): Promise<boolean> | boolean
    reset(): void

    createAxiosInstance(): Promise<AxiosInstance>
}

export interface IFindMaxPages {
    getMaxPages(): Promise<void>
}
