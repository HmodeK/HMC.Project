import { Browser, Page, chromium } from "playwright";

export class BrowserWrapper {
    browser: Browser | undefined
    page: Page | undefined

    getPage = async (url?: string) => {
        this.browser = await chromium.launch();
        const context = await this.browser.newContext();
        this.page = await context.newPage();
        if (url) {
            await this.page.goto(url);
        }
        return this.page
    }

    maximizeWindow = async () => {
        if (!this.page) {
            throw new Error('Browser is not launched yet !!')
        }
        await this.page.setViewportSize({ width: 1920, height: 1080 })
    }

    closeBrowser = async () => {
        await this.browser?.close()
    }


}