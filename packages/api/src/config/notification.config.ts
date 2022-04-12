import { registerAs } from '@nestjs/config'

export interface NotificationConfig {
    watcher: {
        interval: number
        listingCount: number
        minListings: number
    }
}

export default registerAs(
    'notification',
    (): NotificationConfig => ({
        watcher: {
            interval: 2.5 * 24 * 60 * 60 * 1000,
            listingCount: 7,
            minListings: 1,
        },
    })
)
