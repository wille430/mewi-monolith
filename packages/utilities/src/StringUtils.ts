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
    return string
        .split('_')
        .map((word) => capitalize(word))
        .join(' ')
}
export const randomString = (length: number) => {
    let result = ''
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (let i = 0; i < length; i++) {
        result += characters[Math.floor(Math.random() * characters.length)]
    }

    return result
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
