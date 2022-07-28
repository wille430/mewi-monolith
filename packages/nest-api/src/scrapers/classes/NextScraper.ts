import { AxiosInstance } from 'axios'
import puppeteer from 'puppeteer'
import { ListingScraper } from './ListingScraper'

export abstract class NextScraper extends ListingScraper {
    private buildId: string
    useRobots: boolean = false

    async createAxiosInstance(): Promise<AxiosInstance> {
        const client = await super.createAxiosInstance()

        client.interceptors.request.use(async (req) => {
            req.url = req.url.replace('{buildId}', await this.getBuildId())
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

                token = await page.evaluate(() => {
                    const text = document.querySelector('#__NEXT_DATA__').textContent
                    const json: Record<any, any> = JSON.parse(text)

                    return json.buildId
                })
                this.buildId = token
            } catch (e) {
                throw new Error(`Could not retrieve build id from ${this.baseUrl}`)
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
