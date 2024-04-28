import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";


export class allVisitsPage extends BasePage {

    private visitsList: Locator
    private pageTitle: Locator
    private filterByEmployee: Locator
    private listOfEmployeesToFilter: Locator
    private listsOfEmployeesToSelect: Locator
    private submit: Locator
    private searchResult: Locator
    private StatusButton: Locator
    private periodSelectButton: Locator
    private previousMonth: Locator


    constructor(page: Page) {
        super(page)
        this.visitsList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]')
        this.pageTitle = page.locator('//div[@class="MuiGrid-root rtl-rfnosa"]')
        this.filterByEmployee = page.locator('[fill="currentColor"]').nth(1)
        this.listOfEmployeesToFilter = page.locator('//input[@id="Auto_Complete_Filter"]')
        this.listsOfEmployeesToSelect = page.locator('//ul[@id="Auto_Complete_Filter-listbox"]')
        this.submit = page.locator('//button[@type="submit"]')
        this.searchResult = page.locator('//span[@class="MuiChip-label MuiChip-labelMedium rtl-9iedg7"]')
        this.StatusButton = page.locator('//div[@aria-haspopup="listbox"]').nth(1)
        this.periodSelectButton = page.locator('//div[@role="combobox"]').nth(0)
        this.previousMonth = page.locator('//li[@data-value="PREVIOUS_MONTH"]')
        this.initPage()
    }

    checkIfVisitsCancelledExist = async (status: string): Promise<boolean> => {
        const count = await this.visitsList.count()
        for (let i = 0; i < count; i++) {
            if (await this.visitsList.nth(i).innerText() === status) {

                return true
            }
        }
        return false
    }

    getPageTitle = async (): Promise<string> => {
        return await this.pageTitle.first().innerText()
    }

    clickOnfilterByEmployee = async () => {
        await this.filterByEmployee.click()
    }

    clickToSelectEmployeePopup = async () => {
        await this.listOfEmployeesToFilter.click()
    }

    clickOnSubmit = async () => {
        await this.submit.click()
    }

    getSearchResultTitle = async (): Promise<string> => {
        return await this.searchResult.innerText()
    }

    selectItemFromList = async (employeeNum: string): Promise<void> => {

        const ulElement = await this.page.$('//ul[@id="Auto_Complete_Filter-listbox"]');

        if (ulElement) {

            const listItems = await ulElement.$$('li');

            let targetElement = null;
            for (const item of listItems) {
                const text = await item.textContent();
                if (text === employeeNum) {
                    targetElement = item;
                    break;
                }
            }

            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`Item "${employeeNum}" not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    makeFilterAboutEmployees = async (employeeNumber: string) => {
        await this.clickOnfilterByEmployee()
        await this.clickToSelectEmployeePopup()
        await this.selectItemFromList(employeeNumber)
        await this.clickOnSubmit()
    }

    checkIfEmployeeIsFilteredExist = async (employee: string): Promise<boolean> => {
        const count = await this.visitsList.count()
        for (let i = 3; i < count; i += 7) {
            if (await this.visitsList.nth(i).innerText() === employee) {

                return true
            }

        }
        return false
    }

    selectVisitsStatus = async (visitsStatus: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {

            const listOfStatus = await element.$$('li');

            let targetElement = null;
            for (const status of listOfStatus) {
                const text = await status.textContent();
                if (text === visitsStatus) {
                    targetElement = status;
                    await targetElement.click();
                    break;
                }
            }


        }
    }


    clickOnStatusButton = async () => {
        await this.StatusButton.click()
    }

    clickToChangeStatusOfVisits = async (statusVisit: string) => {
        await this.clickOnStatusButton()
        await this.selectVisitsStatus(statusVisit)
        await this.page.waitForTimeout(1000)
    }


    checkStatus = async (statuss: string): Promise<boolean> => {
        const count1 = await this.visitsList.count()
        for (let i = 0; i < count1; i++) {
            if (await this.visitsList.nth(i).innerText() === statuss) {

                return true
            }
        }
        return false
    }

    clickOnPeriodSelectButton = async () => {
        await this.periodSelectButton.click()
    }
    
    clickOnPreviousMonth = async () => {
        await this.previousMonth.click()
    }

    selectPreviousMonth =async () => {
        await this.clickOnPeriodSelectButton()
        await this.clickOnPreviousMonth()
        await this.page.waitForTimeout(1000)
    }
}


