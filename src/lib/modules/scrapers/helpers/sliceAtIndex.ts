export function sliceAtIndex<T>(array: T[], findIndex: Parameters<T[]['findIndex']>[0]) {
    const index = array.findIndex(findIndex)
    return array.slice(0, index)
}
