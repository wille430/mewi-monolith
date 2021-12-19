
const DateUtils = {
    toUnixTime: (dateObj: Date) => {
        return dateObj.getTime()
    },
    toDateObj:  (unixTime: number)  => {
        return new Date(unixTime)
    }
}

export default DateUtils