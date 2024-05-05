import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { PatientsListPage } from "../logic/patients-list-page";

test.describe('Searching about employee & adding new employee', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl);
        // await browser.maximizeWindow();
        const entryToPatiensPage = new SidebarPage(page);
        await entryToPatiensPage.clickOnPatiensIcon()
    });

    test.afterEach(async () => {
        // await page.waitForTimeout(1000)
        await browser.closeBrowser();
    });

    test('Search about  patients && verify the name we are looking for is here', async () => {
        const searchAnPatiens = new PatientsListPage(page)
        await searchAnPatiens.fillPatientNameInSearchField('מטופל דגומה-457')
        await page.waitForTimeout(2000)
        expect(await searchAnPatiens.checkIfPatientNameIsExist('מטופל דגומה-457')).toBeTruthy();
    });

    test('Search for a health insurance fund using (filter) && verify the name we are looking for is here', async () => {
        const searchAnHealthFund = new PatientsListPage(page)
        await searchAnHealthFund.performSelctingFromHealthFundList(config.healthFunds.meuhedet)
        expect(await searchAnHealthFund.checkIfHealthFundsNameIsExist(config.healthFunds.meuhedet)).toBeTruthy();
    });

})