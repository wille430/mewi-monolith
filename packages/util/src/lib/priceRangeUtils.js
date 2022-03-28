'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
const PriceRangeUtils = {
    toString: (obj) => {
        if (!obj || (!obj.gte && !obj.lte)) return null
        return `${obj.gte || ''}-${obj.lte || ''}`
    },
    toObject: (string) => {
        const defaultPriceRangeObject = {
            gte: '',
            lte: '',
        }
        if (!string) return defaultPriceRangeObject
        const arr = string.split('-')
        const returnObj = defaultPriceRangeObject
        if (arr[0]) returnObj.gte = arr[0]
        if (arr[1]) returnObj.lte = arr[1]
        return returnObj
    },
}
exports.default = PriceRangeUtils
//# sourceMappingURL=priceRangeUtils.js.map
