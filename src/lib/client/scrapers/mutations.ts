import { ListingOrigin } from '@/common/schemas'
import { ScraperStatus, ScraperStatusReport } from '@/common/types'
import type { DeleteListingsDto } from '@/lib/modules/listings/dto/delete-listings.dto'
import { client, MutationArgs } from '..'
import { SCRAPERS_STATUS_KEY } from './swr-keys'

export const startScrapers = (scrapers: ListingOrigin[]): MutationArgs => {
    const updateFn = async (statusReports: Record<string, ScraperStatusReport>) => {
        await client.post('/scrapers/start', {
            scrapers,
        })
        return statusReports
    }

    const optimisticData = (statusReports: Record<string, ScraperStatusReport> = {}) => {
        statusReports[scrapers[0]].status = ScraperStatus.QUEUED
        return statusReports
    }

    return [
        SCRAPERS_STATUS_KEY,
        updateFn,
        {
            optimisticData,
        },
    ]
}

export const deleteListingsFrom = (origins: ListingOrigin[]): MutationArgs => {
    const updateFn = async (data: any) => {
        await client.delete('/listings', {
            data: {
                origins,
            } as DeleteListingsDto,
        })
        return data
    }

    const optimisticData = (statusReports: Record<string, ScraperStatusReport> = {}) => {
        for (const origin of origins) {
            statusReports[origin].listings_current = 0
        }
        return statusReports
    }

    return [
        SCRAPERS_STATUS_KEY,
        updateFn,
        {
            optimisticData,
        },
    ]
}
