import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import { Header } from "../logic/header-page";

test.describe('logout test', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl)
        // await browser.maximizeWindow()
    });

    test.afterEach(async () => {
        await browser.closeBrowser()
    });

    test('check user is logged out & navigate to login page', async () => {
        const clickOnHeaderIcon = new Header(page)
        await clickOnHeaderIcon.makeLogout()
        expect(urls.uiUrl.websiteUrl).toBe('https://demo.hmchealth.co.il/login')
        await page.waitForTimeout(1000)
    })
})