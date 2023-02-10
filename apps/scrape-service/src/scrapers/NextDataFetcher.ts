import axios from "axios"
import {load} from "cheerio"

export class NextDataFetcher {

    private readonly nextDataSelector: string
    private readonly url: string

    constructor(url: string, nextDataSelector: string = "#__NEXT_DATA__") {
        this.url = url
        this.nextDataSelector = nextDataSelector
    }

    public async getJson(): Promise<Record<any, any>> {
        const {data: html} = await axios.get(this.url)
        const $ = load(html)

        const nextDataSelector = '#__NEXT_DATA__'
        const text = $(nextDataSelector).first().text()

        if (text == null) {
            throw new Error(
                `Could not scrape token from ${document.location.href}. Selector ${nextDataSelector} might be missing`
            )
        }

        return JSON.parse(text)
    }
}