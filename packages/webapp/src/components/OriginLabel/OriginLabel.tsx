import type { ListingOrigin } from '@mewi/prisma'

export const OriginLabel = ({ origin }: { origin: ListingOrigin }) => {
    const originColors: Record<ListingOrigin, string> = {
        Blocket: 'red',
        Blipp: 'green',
        Tradera: 'green',
        Sellpy: 'black',
        Citiboard: 'green',
    }

    return <span style={{ color: originColors[origin] }}>{origin}</span>
}
