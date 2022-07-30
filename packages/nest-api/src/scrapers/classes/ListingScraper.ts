import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { Inject } from '@nestjs/common'
import { EntryPoint } from './EntryPoint'
import { CreateConfigFunction } from './types/CreateConfigFunction'
import { BaseListingScraper } from './BaseListingScraper'
import { PrismaService } from '@/prisma/prisma.service'
import { ScrapedListing } from './types/ScrapedListing'

export abstract class ListingScraper extends BaseListingScraper {
    entryPoints: EntryPoint[]

    constructor(@Inject(PrismaService) readonly prisma: PrismaService) {
        super()
        this.parseRawListing = this.parseRawListing.bind(this)
    }

    readonly defaultAxiosRequestConfig: AxiosRequestConfig = {}

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
    parseRawListing(obj: Record<string, any>): ScrapedListing {
        return obj as any
    }

    createEntryPoint(createConfig: CreateConfigFunction, identifier?: string) {
        if (!this.entryPoints) this.entryPoints = []

        this.entryPoints.push(
            new EntryPoint(this.prisma, this, createConfig, identifier ?? this.origin)
        )
    }
}
