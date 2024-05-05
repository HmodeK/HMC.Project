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
        await page.waitForTimeout(3000)
    });

    test.afterEach(async () => {
        await browser.closeBrowser()
    });

    // test('Go to canceled visits and select a month back and check if all visits is cancelled', async () => {
    //     const checkVisitsStatus = new allVisitsPage(page)
    //     await checkVisitsStatus.selectPreviousMonth()
    //     expect(await checkVisitsStatus.checkIfVisitsCancelledExist(config.visitsStatus.cancelled)).toBeTruthy()
    // })

    test('navigate to the correct page[all visits] we are looking for & check if it navigates to the right page', async () => {
        const getTitle = new allVisitsPage(page)
        expect(await getTitle.getPageTitle()).toContain('כל הביקורים')
    })

    test('navigate to the correct sidebar we are looking for & check if it navigates to the right page', async () => {
        const getTitle2 = new SidebarPage(page)
        expect(await getTitle2.getTheSelectedSidebarTitle()).toContain('כל הביקורים')
    })

    // test('Filter an employee from the list and check if filtered or not ', async () => {
    //     const filterAboutEmployee = new allVisitsPage(page)
    //     await filterAboutEmployee.selectPreviousMonth()
    //     await filterAboutEmployee.makeFilterAboutEmployees(config.employees.employee7)
    //     expect(await filterAboutEmployee.checkIfEmployeeIsFilteredExist(config.employees.employee7)).toBeTruthy()
    // })

    test('check  if the status is changing at all the list we are looking for', async () => {
        const checkAboutStatusOfVisits = new allVisitsPage(page)
        await checkAboutStatusOfVisits.clickToChangeStatusOfVisits(config.visitsStatus.notPerformed)
        expect(await checkAboutStatusOfVisits.checkStatus(config.visitsStatus.notPerformed)).toBeTruthy()
    })



    //בשני המבחנים המסומנים בהערה - אין נתונים 
})