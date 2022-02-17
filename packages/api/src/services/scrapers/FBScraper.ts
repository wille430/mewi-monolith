import Scraper from './Scraper'
import { JSDOM } from 'jsdom'

// TODO: COMPLETE CLASS
export default class FBScraper extends Scraper {
    baseUrl = 'https://www.facebook.com/marketplace'
    page = 1

    constructor(maxEntries?: number) {
        super({
            maxEntries,
            name: 'facebook',
            limit: 40,
        })
    }

    async categories() {
        return []
    }

    async getNextArticles() {
        const dom = await JSDOM.fromURL('https://www.facebook.com/marketplace/categories')
        const { document } = dom.window

        // find category list
        // const catList = document.getSelection('')

        return []
    }
}
