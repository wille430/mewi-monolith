import { PriceRange } from '@mewi/types'

const PriceRangeUtils = {
    toString: (obj?: PriceRange) => {
        if (!obj || (!obj.gte && !obj.lte)) return undefined
        return `${obj.gte || ''}-${obj.lte || ''}`
    },
    toObject: (string: string | null): PriceRange => {
        const defaultPriceRangeObject = {}

        if (!string) return defaultPriceRangeObject
        const arr = string.split('-')
        const returnObj: PriceRange = defaultPriceRangeObject
        if (arr[0]) returnObj.gte = parseInt(arr[0])
        if (arr[1]) returnObj.lte = parseInt(arr[1])
        return returnObj
    },
}

export default PriceRangeUtils
