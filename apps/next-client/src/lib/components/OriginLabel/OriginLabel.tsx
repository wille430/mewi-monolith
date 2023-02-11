import type { ListingOrigin } from '@/common/schemas'
import { getColor } from '@mewi/utilities'

export const OriginLabel = ({ origin }: { origin: ListingOrigin }) => {
    return <span style={{ color: getColor(origin) }}>{origin}</span>
}
