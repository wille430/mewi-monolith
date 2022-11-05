export const removeNullValues = (obj: Record<any, any>) => {
    return Object.keys(obj)
        .filter((key) => !!obj[key])
        .reduce((o, v) => ((o[v] = obj[v]), o), {})
}
