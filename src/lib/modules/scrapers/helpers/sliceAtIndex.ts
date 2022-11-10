export function sliceAtIndex<T>(array: T[], findIndex: Parameters<T[]['findIndex']>[0]) {
    const index = array.findIndex(findIndex)

    if (index >= 0) {
        return array.slice(0, index)
    } else {
        return array
    }
}
