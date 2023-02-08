export const safeToDate = (date: string | number | Date | undefined): Date | undefined => {
    if (date) {
        const obj = new Date(date)

        if (obj instanceof Date && isFinite(obj as any)) {
            return obj
        } else {
            return undefined
        }
    } else {
        return undefined
    }
}
