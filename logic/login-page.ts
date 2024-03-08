import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class LoginPage extends BasePage {
    private emailField: Locator
    private passwordField: Locator
    private submitButton: Locator

    constructor(page: Page) {
        super(page)
        this.emailField = page.locator('//input[@type="email"]')
        this.passwordField = page.locator('//input[@name="password"]')
        this.submitButton = page.locator('//button [@type="submit"]')
        this.initPage()
    }

    fillUserName = async (userName: string) => {
        await this.emailField.fill(userName)
    }

    fillUserPassword = async (userPass: string) => {
        await this.passwordField.fill(userPass)
    }

    clickLoginButton = async () => {
        await this.submitButton.click()
    }

    makeLogin = async (userName: string, userPass: string) => {
        await this.fillUserName(userName)
        await this.fillUserPassword(userPass)
        await this.clickLoginButton()
    }
}