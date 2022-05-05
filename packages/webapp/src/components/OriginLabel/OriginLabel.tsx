import type { ListingOrigins } from '@wille430/common'

export const OriginLabel = ({ origin }: { origin: ListingOrigins }) => {
    const originColors: Record<ListingOrigins, string> = {
        Blocket: 'red',
        Blipp: 'green',
        Tradera: 'green',
        Sellpy: 'black',
    }

    return <span style={{ color: originColors[origin] }}>{origin}</span>
}
