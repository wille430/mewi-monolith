import { ListingOrigin } from '@mewi/prisma'
import { Matches } from 'class-validator'

export class StartOneScraperDto {
    @Matches(
        `^${Object.values(ListingOrigin)
            .filter((v) => typeof v !== 'number')
            .join('|')}$`,
        'i'
    )
    scraperName: ListingOrigin
}
