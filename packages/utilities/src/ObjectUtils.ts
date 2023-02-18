export const searchParamsToObject = (searchParams: URLSearchParams) => {
    const map = {}

    const it = searchParams.entries()
    let next = it.next()
    while (next.done === false) {
        map[next.value[0]] = next.value[1]
        next = it.next()
    }

    return map
}
