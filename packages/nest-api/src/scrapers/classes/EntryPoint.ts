import { PrismaService } from '@/prisma/prisma.service'
import { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Page } from 'puppeteer'

export interface CreateConfigFunction {
    (page: number): Promise<AxiosRequestConfig> | AxiosRequestConfig
}

export interface CreateIndexedUrlFunction {
    (page: number, i: number): string
}

export interface GetTotalPagesFunction<T> {
    (res: T extends 'DOM' ? Page : AxiosResponse): number
}

export type ScrapeTargetType = 'DOM' | 'API'

export class BaseEntryPoint<T extends ScrapeTargetType> {
    constructor(
        readonly prisma: PrismaService,
        createConfig: CreateConfigFunction,
        getTotalPages: GetTotalPagesFunction<T> | undefined,
        identifier: string
    ) {
        this.createConfig = createConfig
        this.identifier = identifier
        this.getTotalPages = getTotalPages
    }

    public createConfig: CreateConfigFunction
    public getTotalPages: GetTotalPagesFunction<T>
    public identifier: string | undefined

    public getMostRecentListing() {
        return this.prisma.listing.findFirst({
            where: {
                entryPoint: this.identifier,
            },
            orderBy: {
                date: 'desc',
            },
        })
    }

    static create<T extends ScrapeTargetType>(
        ...args: ConstructorParameters<typeof BaseEntryPoint<T>>
    ): BaseEntryPoint<T> {
        return new BaseEntryPoint<T>(...args)
    }
}

export class EntryPoint extends BaseEntryPoint<'API'> {}
export class EntryPointDOM extends BaseEntryPoint<'DOM'> {}
