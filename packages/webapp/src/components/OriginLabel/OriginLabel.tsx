import { getColor } from '@/constants/OriginColors'
import type { ListingOrigin } from '@wille430/common'

export const OriginLabel = ({ origin }: { origin: ListingOrigin }) => {
    return <span style={{ color: getColor(origin) }}>{origin}</span>
}
