import queryString from 'query-string'
import _ from 'lodash'

export const capitalize = (string: string) => {
    const newString = string.split('')
    newString[0] = newString[0]?.toUpperCase()
    return newString.join('')
}
export const toSnakeCase = (string: string) => {
    string = string
        .split('')
        .map((char) => char.toLowerCase())
        .join('')
        .replace(/ & /g, ' ')
    return string.replace(/ /g, '_')
}
export const snakeCaseToRegularCase = (string: string) => {
    const newString = string
        .split('_')
        .map((word) => capitalize(word))
        .join(' ')
    return newString
}
export const randomString = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)]
    }

    return result
}
export const stringifyNestedObject = (object: Record<string, unknown>, isChild = false) => {
    if (typeof object !== 'object') {
        return object
    } else {
        object = _.clone(object)
    }

    for (const key of Object.keys(object)) {
        if (typeof object[key] === 'object') {
            object[key] = stringifyNestedObject(object[key] as Record<string, unknown>, true)
        }
    }

    if (isChild) {
        return queryString.stringify(object)
    }

    return object as Record<string, string>
}

export const parseNestedStringifiedObject = (string: string) => {
    const object: Record<string, unknown> = {}
    const parsed = queryString.parse(string)

    if (!Object.values(parsed)[0]) {
        return string
    }

    _.forOwn(parsed, (val, key) => {
        if (typeof val === 'string') {
            object[key] = parseNestedStringifiedObject(val as string)
        }
    })

    return object
}
