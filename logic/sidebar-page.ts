import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class SidebarPage extends BasePage {
    private dashboardIcon: Locator
    private workersIcon: Locator
    private patientsIcon: Locator
    private healthFundsIcon: Locator
    private allVisitsIcon: Locator
    private allProgramsIcon: Locator
    private dischargeReportIcon: Locator
    private hospiceDischargeReportIcon: Locator
    private employeesFinancialReportIcon: Locator
    private treatmentPlanFinancialReportIcon: Locator
    private systemReportsIcon: Locator


    constructor(page: Page) {
        super(page)
        this.dashboardIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').first()
        this.workersIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(1)
        this.patientsIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(2)
        this.healthFundsIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(3)
        this.allVisitsIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(4)
        this.allProgramsIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(5)
        this.dischargeReportIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(6)
        this.hospiceDischargeReportIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(7)
        this.employeesFinancialReportIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(8)
        this.treatmentPlanFinancialReportIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').nth(9)
        this.systemReportsIcon = page.locator('//div[@class="MuiListItemText-root rtl-xdiy5h"]').last()
        this.initPage()
    }

    getTheSelectedSidebarTitle = async (): Promise<string> => {
        return await this.allVisitsIcon.innerText()
    }

}