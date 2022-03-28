import { PriceRangeProps } from '@mewi/types'

const PriceRangeUtils = {
    toString: (obj: PriceRangeProps) => {
        if (!obj || (!obj.gte && !obj.lte)) return null
        return `${obj.gte || ''}-${obj.lte || ''}`
    },
    toObject: (string: string | null): PriceRangeProps => {
        const defaultPriceRangeObject = {
            gte: '',
            lte: '',
        }

        if (!string) return defaultPriceRangeObject
        const arr = string.split('-')
        const returnObj: PriceRangeProps = defaultPriceRangeObject
        if (arr[0]) returnObj.gte = arr[0]
        if (arr[1]) returnObj.lte = arr[1]
        return returnObj
    },
}

export default PriceRangeUtils
