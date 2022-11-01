export const relativeLuminance = (r: number, g: number, b: number) => {
    return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
}

/**
 * Convert hexadecimal color to RGB
 *
 * @param hex Color in hexadecimal from (without # character)
 * @returns [R, G, B]
 */
export const hexToRgb = (hex: string) => {
    const pairs = hex.replace('#', '').match(/.{1,2}/g)

    if (!pairs) {
        return [0, 0, 0]
    }

    return [parseInt(pairs[0], 16), parseInt(pairs[1], 16), parseInt(pairs[2], 16)]
}
