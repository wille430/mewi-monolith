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

export const stringSimilarity = (s1: string, s2: string) => {
    let longer = s1
    let shorter = s2

    if (s1.length < s2.length) {
        longer = s2
        shorter = s1
    }

    const longerLength = longer.length
    if (longerLength === 0) {
        return 1.0
    }

    return (longerLength - editDistance(longer, shorter)) / longerLength
}

export const editDistance = (s1: string, s2: string) => {
    s1 = s1.toLowerCase()
    s2 = s2.toLowerCase()

    const costs: number[] = []
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j
            } else {
                if (j > 0) {
                    let newValue = costs[j - 1]
                    if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
                        costs[j - 1] = lastValue
                        lastValue = newValue
                    }
                }
            }
        }
        if (i > 0) {
            costs[s2.length] = lastValue
        }
    }

    return costs[s2.length]
}
