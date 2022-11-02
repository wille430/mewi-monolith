export const trimLastFromArray = (array: any[], count: number): any[] => {
    return array.splice(0, array.length - count)
}
