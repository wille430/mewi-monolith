'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.parseNestedStringifiedObject =
    exports.stringifyNestedObject =
    exports.randomString =
    exports.snakeCaseToRegularCase =
    exports.toSnakeCase =
    exports.capitalize =
        void 0
const tslib_1 = require('tslib')
const query_string_1 = tslib_1.__importDefault(require('query-string'))
const lodash_1 = tslib_1.__importDefault(require('lodash'))
const capitalize = (string) => {
    var _a
    const newString = string.split('')
    newString[0] = (_a = newString[0]) === null || _a === void 0 ? void 0 : _a.toUpperCase()
    return newString.join('')
}
exports.capitalize = capitalize
const toSnakeCase = (string) => {
    string = string
        .split('')
        .map((char) => char.toLowerCase())
        .join('')
        .replace(/ & /g, ' ')
    return string.replace(/ /g, '_')
}
exports.toSnakeCase = toSnakeCase
const snakeCaseToRegularCase = (string) => {
    const newString = string
        .split('_')
        .map((word) => (0, exports.capitalize)(word))
        .join(' ')
    return newString
}
exports.snakeCaseToRegularCase = snakeCaseToRegularCase
const randomString = (length) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)]
    }
    return result
}
exports.randomString = randomString
const stringifyNestedObject = (object, isChild = false) => {
    if (typeof object !== 'object') {
        return object
    } else {
        object = lodash_1.default.clone(object)
    }
    for (const key of Object.keys(object)) {
        if (typeof object[key] === 'object') {
            object[key] = (0, exports.stringifyNestedObject)(object[key], true)
        }
    }
    if (isChild) {
        return query_string_1.default.stringify(object)
    }
    return object
}
exports.stringifyNestedObject = stringifyNestedObject
const parseNestedStringifiedObject = (string) => {
    const object = {}
    const parsed = query_string_1.default.parse(string)
    if (!Object.values(parsed)[0]) {
        return string
    }
    lodash_1.default.forOwn(parsed, (val, key) => {
        if (typeof val === 'string') {
            object[key] = (0, exports.parseNestedStringifiedObject)(val)
        }
    })
    return object
}
exports.parseNestedStringifiedObject = parseNestedStringifiedObject
//# sourceMappingURL=stringUtils.js.map
