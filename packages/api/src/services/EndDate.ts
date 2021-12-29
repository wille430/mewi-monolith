import * as fs from 'fs'

interface endDates {
    [key: string]: string
}

export default class EndDate {
    static filePath = __dirname + '/lastDate.txt'

    static getEndDates(): endDates | {} {
        try {
            // Read text from file
            const text = fs.readFileSync(this.filePath, { encoding: 'utf-8' })

            // Convert to json
            const dates = JSON.parse(text)

            // Return object with keys for each marketplace
            return dates
        } catch (e) {
            console.log('Missing', this.filePath)
            return {}
        }
    }

    static setEndDates(newEndDates: endDates) {
        try {
            console.log(JSON.stringify(newEndDates) + ' >> ' + this.filePath)
            fs.writeFileSync(this.filePath, JSON.stringify(newEndDates))
        } catch (e) {
            console.log(e.message)
        }
    }

    static getEndDateFor(marketplaceName: string): Date {
        try {
            const endDates = EndDate.getEndDates()
            let endDate = endDates[marketplaceName]
                ? parseInt(endDates[marketplaceName])
                : Date.now() - 14 * 24 * 60 * 60 * 1000
            return new Date(endDate)
        } catch (e) {
            console.log(e.message)
        }
    }

    static setEndDateFor(marketplaceName: string, date: number) {
        const oldEndDates = this.getEndDates()
        oldEndDates[marketplaceName] = date.toString()
        this.setEndDates(oldEndDates)
    }
}
