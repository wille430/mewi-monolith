import WatcherNotificationService from './WatcherNotificationService'

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

describe('Watcher Notification Service', () => {
    it('should only notify if last notification was mote than 24 hours ago', () => {
        const startDate = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
        const endDate = new Date()

        const dates: Date[] = new Array(10).fill(randomDate(startDate, endDate))

        for (const date of dates) {
            const shouldBeNotified = WatcherNotificationService.userShouldBeNotified(date)

            if (Date.now() - date.getTime() > 24 * 60 * 60 * 1000) {
                expect(shouldBeNotified).toBe(true)
            } else {
                expect(shouldBeNotified).toBe(false)
            }
        }
    })
})
