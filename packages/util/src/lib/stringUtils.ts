export const capitalize = (string: string) => {
    const newString = string.split('')
    newString[0] = newString[0].toUpperCase()
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
