import { ListingOrigins } from '@wille430/common'
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
