export const fetchJson = async (input: RequestInfo, init?: RequestInit) => {
    const res = await fetch(input, init)

    const data = await res.json()

    if (res.ok) {
        return data
    } else {
        throw data
    }
}
