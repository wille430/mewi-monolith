import axios from 'axios'
import { JSDOM } from 'jsdom'
import { Page } from 'puppeteer'

export const getNextDataEval = async (page: Page): Promise<any> => {
    return await page.evaluate(() => {
        const nextDataSelector = '#__NEXT_DATA__'
        const text = document.querySelector(nextDataSelector)?.textContent

        if (text == null) {
            throw new Error(
                `Could not scrape token from ${document.location.href}. Selector ${nextDataSelector} might be missing`
            )
        }

        const json: Record<any, any> = JSON.parse(text)

        return json
    })
}

export const getNextData = async (url: string): Promise<any> => {
    const nextDataSelector = '#__NEXT_DATA__'
    const { data } = await axios.get(url)

    const dom = new JSDOM(data)
    const { document } = dom.window

    const nextDataNode = document.querySelector(nextDataSelector)
    const text = nextDataNode?.textContent
    if (text == null) {
        throw new Error(
            `Could not scrape token from ${document.location.href}. Selector ${nextDataSelector} might be missing`
        )
    }

    const json: Record<any, any> = JSON.parse(text)
    return json
}
