import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class DashboardPage extends BasePage {
    private visitsCancelled: Locator


    constructor(page: Page) {
        super(page)
        this.visitsCancelled = page.locator('//div[@class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-3 rtl-1ha4th6"]').nth(2)
        this.initPage()
    }

    clickOnVisitsCancelledIcon = async () => {
        await this.page.waitForTimeout(1000)
        await this.visitsCancelled.click()
    }
}