export const toUnixTime = (dateObj: Date) => {
    return dateObj.getTime()
}

export const safeToDate = (date: string | number | Date | undefined): Date | undefined => {
    if (date) {
        return new Date(date)
    } else {
        return undefined
    }
}
