import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class allVisitsPage extends BasePage {
    private visitsList: Locator
    private pageTitle: Locator


    constructor(page: Page) {
        super(page)
        this.visitsList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]')
        this.pageTitle = page.locator('//div[@class="MuiGrid-root rtl-rfnosa"]')
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
}