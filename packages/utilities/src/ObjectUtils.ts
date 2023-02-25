export const searchParamsToObject = (searchParams: URLSearchParams) => {
    const map = {}

    const it = searchParams.entries()
    let next = it.next()
    while (next.done === false) {
        const key = next.value[0]
        const val = next.value[1]
        if (map[key] != null)  {
            if (!Array.isArray(map[key])) {
                map[key] = [map[key]]
            }
            map[key].push(val)
        } else {
            map[key] = val
        }

        next = it.next()
    }

    return map
}

export const prettyStringify = (obj: Record<any, any>) => {
    let str = "";

    for (const kv of Object.entries(obj)) {
        str += `${kv[0]}=${kv[1]}`;
        str += " ";
    }

    return str.trim();
}