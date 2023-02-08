import type { ListingOrigin } from '@/common/schemas'
import { hexToRgb, relativeLuminance } from '../utils/colors'

export const BLOCKET_COLOR = '#f71414'
export const BLIPP_COLOR = '#000033'
export const TRADERA_COLOR = '#fef880'
export const SELLPY_COLOR = '#075dbe'
export const CITIBOARD_COLOR = '#f1543b'
export const BYTBIL_COLOR = '#525350'
export const SHPOCK_COLOR = '#43c46d'
export const KVDBIL_COLOR = '#f6b401'
export const BILWEB_COLOR = '#1190c6'

export const OriginColorMap: Record<ListingOrigin, string> = {
    Blocket: BLOCKET_COLOR,
    Tradera: TRADERA_COLOR,
    Sellpy: SELLPY_COLOR,
    Blipp: BLIPP_COLOR,
    Citiboard: CITIBOARD_COLOR,
    Shpock: SHPOCK_COLOR,
    Bytbil: BYTBIL_COLOR,
    Kvdbil: KVDBIL_COLOR,
    Bilweb: BILWEB_COLOR,
}

export const getColor = (origin: ListingOrigin) => {
    return OriginColorMap[origin]
}

export const getTextColor = (origin: ListingOrigin) => {
    const [r, g, b] = hexToRgb(getColor(origin))
    const luminance = relativeLuminance(r, g, b)

    if (luminance < 0.5) {
        return '#fff'
    } else {
        return '#000'
    }
}
