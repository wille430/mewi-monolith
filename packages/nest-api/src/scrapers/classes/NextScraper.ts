import { AxiosInstance } from 'axios'
import puppeteer from 'puppeteer'
import { ListingWebCrawler } from './ListingWebCrawler'

export class NextScraper extends ListingWebCrawler {
    private buildId: string
    useRobots: boolean = false

    async addAuthentication(axios: AxiosInstance): Promise<AxiosInstance> {
        super.addAuthentication(axios)

        axios.interceptors.request.use(async (req) => {
            if (req.url === this.scrapeTargetUrl) {
                req.url.replace('{buildId}', await this.getBuildId())
            }

            return req
        })

        return axios
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
            } catch (e) {
                console.log('Could not find token')
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
