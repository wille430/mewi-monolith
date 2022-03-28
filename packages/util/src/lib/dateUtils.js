'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.toDateObj = exports.toUnixTime = void 0
const toUnixTime = (dateObj) => {
    return dateObj.getTime()
}
exports.toUnixTime = toUnixTime
const toDateObj = (unixTime) => {
    return new Date(unixTime)
}
exports.toDateObj = toDateObj
//# sourceMappingURL=dateUtils.js.map
