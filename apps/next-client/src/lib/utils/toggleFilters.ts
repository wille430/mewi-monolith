export const toggleElement = <T>(key: string, value: T, selected: boolean) => {
    if (selected) {
        return (prev) => ({
            ...prev,
            [key]: prev[key]?.includes(value) ? prev[key] : [...(prev[key] ?? []), value],
        })
    } else {
        return (prev) => ({
            ...prev,
            [key]: prev[key]?.filter((x) => x !== value),
        })
    }
}
