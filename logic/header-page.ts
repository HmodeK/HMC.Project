import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class Header extends BasePage {
    private loggedinUsernameIcon: Locator
    private logout: Locator


    constructor(page: Page) {
        super(page)
        this.loggedinUsernameIcon = page.locator('//div [@class="MuiAvatar-root MuiAvatar-circular rtl-1ciwozm"]')
        this.logout = page.locator('//button[@type="button"]').nth(4)
        this.initPage()
    }

    clickOnLoggedinUsernameIcon = async () => {
        await this.loggedinUsernameIcon.click()
    }

    clickOnLogoutField = async () => {
        await this.logout.click()
    }

    makeLogout = async () => {
        await this.clickOnLoggedinUsernameIcon()
        await this.clickOnLogoutField()
    }
}