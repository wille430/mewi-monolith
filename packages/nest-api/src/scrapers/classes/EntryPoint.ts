import { PrismaService } from '@/prisma/prisma.service'
import { AxiosResponse } from 'axios'
import { Page } from 'puppeteer'

export interface CreateUrlFunction {
    (page: number): string
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
        createUrl: CreateUrlFunction,
        getTotalPages?: GetTotalPagesFunction<T>,
        identifier?: string
    ) {
        this.createUrl = createUrl
        this.identifier = identifier
        this.getTotalPages = getTotalPages
    }

    public createUrl: CreateUrlFunction
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
