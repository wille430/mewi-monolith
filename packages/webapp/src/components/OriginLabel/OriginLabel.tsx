import type { ListingOrigin } from '@prisma/client'

export const OriginLabel = ({ origin }: { origin: ListingOrigin }) => {
    const originColors: Record<ListingOrigin, string> = {
        Blocket: 'red',
        Blipp: 'green',
        Tradera: 'green',
        Sellpy: 'black',
    }

    return <span style={{ color: originColors[origin] }}>{origin}</span>
}
