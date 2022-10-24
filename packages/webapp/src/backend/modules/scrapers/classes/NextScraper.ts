import type { AxiosInstance } from 'axios'
import * as puppeteer from 'puppeteer'
import { ListingScraper } from './ListingScraper'
import { getNextDataEval } from '../helpers/getNextData'

export abstract class NextScraper extends ListingScraper {
    private buildId: string | undefined
    useRobots = false

    async createAxiosInstance(): Promise<AxiosInstance> {
        const client = await super.createAxiosInstance()

        client.interceptors.request.use(async (req) => {
            if (req.url) {
                req.url = req.url.replace('{buildId}', await this.getBuildId())
            }

            return req
        })

        return client
    }

    async getBuildId(): Promise<string> {
        if (this.buildId) {
            return this.buildId
        } else {
            const browser = await puppeteer.launch({
                args: ['--no-sandbox'],
            })
            let token: string | undefined
            try {
                const page = await browser.newPage()
                await page.goto(this.baseUrl)

                token = (await getNextDataEval(page).then((res) => res.buildId)) as string
                this.buildId = token
            } catch (e) {
                throw new Error(`Could not retrieve build id from ${this.baseUrl}. Reason: ${e}`)
            } finally {
                await browser.close()
            }

            return token
        }
    }

    reset(): void {
        this.buildId = undefined
    }
}
