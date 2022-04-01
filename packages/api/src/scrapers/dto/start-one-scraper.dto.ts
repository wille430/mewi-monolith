import { ListingOrigins } from '@mewi/common/types'
import { Matches } from 'class-validator'

export class StartOneScraperDto {
    @Matches(
        `^${Object.values(ListingOrigins)
            .filter((v) => typeof v !== 'number')
            .join('|')}$`,
        'i'
    )
    scraperName: ListingOrigins
}
