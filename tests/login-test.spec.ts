import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"

test.describe('login test', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl)
    });

    test.afterEach(async () => {
        await browser.closeBrowser
    });

    test('check user is logged in & navigate to another URL', async () => {
        expect(urls.uiUrl.websiteUrlAfterLogin).toBe("https://demo.hmchealth.co.il/app/dashboard");
        await page.waitForTimeout(1000)
    })
})