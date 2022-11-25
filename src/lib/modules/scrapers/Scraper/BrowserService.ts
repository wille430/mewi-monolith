import Chromium from 'chrome-aws-lambda'
import puppeteer, { Browser, PuppeteerLaunchOptions } from 'puppeteer-core'

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
            return {
                args: [],
                executablePath:
                    process.platform === 'win32'
                        ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
                        : process.platform === 'linux'
                        ? '/usr/bin/chromium'
                        : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            }
        }
    }

    private async getBrowser() {
        if (this.browser) {
            return this.browser
        } else {
            this.browser = (await puppeteer.launch(await this.getLaunchOptions())) as any
        }

        return this.browser as Browser
    }

    close() {
        return this.browser?.close()
    }
}
