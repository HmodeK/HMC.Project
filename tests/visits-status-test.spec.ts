import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { DashboardPage } from "../logic/dashboard-page";
import { allVisitsPage } from "../logic/all-visits-page";
import { SidebarPage } from "../logic/sidebar-page";

test.describe('visits status test', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl)
        // await browser.maximizeWindow()
        const clickOnVistsCancelled = new DashboardPage(page)
        await clickOnVistsCancelled.clickOnVisitsCancelledIcon()
        await page.waitForTimeout(1000)
    });

    test.afterEach(async () => {
        await browser.closeBrowser()
    });

    test('check if all queues are cancelled', async () => {
        const checkVisitsStatus = new allVisitsPage(page)
        expect(await checkVisitsStatus.checkIfVisitsCancelledExist(config.visitsStatus.cancelled)).toBeTruthy()
        await page.waitForTimeout(1000)
    })

    test('navigate to the correct page we are looking for', async () => {
        const getTitle = new allVisitsPage(page)
        expect(await getTitle.getPageTitle()).toContain('כל הביקורים')
    })

    test('navigate to the correct sidebar we are looking for', async () => {
        const getTitle2 = new SidebarPage(page)
        expect(await getTitle2.getTheSelectedSidebarTitle()).toContain('כל הביקורים')
    })




})