import {ListingOrigin} from '@/common/schemas'
import {ScraperStatusReport} from '@/common/types'
import type {DeleteListingsDto} from '@/lib/modules/listings/dto/delete-listings.dto'
import {client, MutationArgs} from '../index'
import {SCRAPERS_STATUS_KEY} from './swr-keys'

export const startScrapers = (): MutationArgs => {
    const updateFn = async (statusReports: Record<string, ScraperStatusReport>) => {
        return statusReports
    }

    const optimisticData = (statusReports: Record<string, ScraperStatusReport> = {}) => {
        // TODO: deprecate
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
