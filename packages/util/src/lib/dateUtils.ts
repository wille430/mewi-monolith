export const toUnixTime = (dateObj: Date) => {
    return dateObj.getTime()
}

export const toDateObj = (unixTime: number) => {
    return new Date(unixTime)
}
