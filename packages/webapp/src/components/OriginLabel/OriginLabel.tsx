import { getColor } from '@/constants/OriginColors'
import type { ListingOrigin } from '@mewi/prisma'

export const OriginLabel = ({ origin }: { origin: ListingOrigin }) => {
    return <span style={{ color: getColor(origin) }}>{origin}</span>
}
