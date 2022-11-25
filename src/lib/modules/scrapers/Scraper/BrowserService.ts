import Chromium from '@sparticuz/chrome-aws-lambda'
import { Browser, PuppeteerLaunchOptions } from 'puppeteer'

export class BrowserService {
    options: PuppeteerLaunchOptions = {
        args: Chromium.args,
        headless: Chromium.headless,
    }

    private browser: Browser | undefined

    async getPage(url?: string) {
        const browser = await this.getBrowser()

        const page = await browser.newPage()

        if (url) {
            await page.goto(url)
        }

        return page
    }

    private async getLaunchOptions() {
        if (process.env.NODE_ENV === 'production') {
            return {
                ...this.options,
                executablePath: await Chromium.executablePath,
            }
        } else {
            return {}
        }
    }

    private async getBrowser() {
        if (this.browser) {
            return this.browser
        } else {
            this.browser = (await Chromium.puppeteer.launch(await this.getLaunchOptions())) as any
        }

        return this.browser as Browser
    }

    close() {
        return this.browser?.close()
    }
}
