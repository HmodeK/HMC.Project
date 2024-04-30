import { BasePage } from "../infra/browser/base-page";
import { Dialog, ElementHandle, Locator, Page } from "playwright";

export class EmployeeList extends BasePage {
    private searchBar: Locator;
    private employeesList: Locator;
    private employeeStatusButton: Locator;/////////////////////////////////////////////  A question to check
    linkByHref: (hrefValue: any) => Locator;
    private newUserLink: Locator;
    private yesButtonPopup: Locator;
    private noButtonPopup: Locator;
    private alertPopup: Locator;
    private newPasswordReset: Locator;
    private passwordVerificationToReset: Locator;
    private passwordResetButton: Locator;
    private cancelation: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('//input[@type="search"]');
        this.employeesList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.employeeStatusButton = page.locator('//div[@aria-haspopup="listbox"]').first();
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.newUserLink = this.linkByHref('/app/user/new');
        this.yesButtonPopup = page.locator('//button[@type="button"]').nth(25)
        this.noButtonPopup = page.locator('//button[@type="button"]').nth(26)
        this.alertPopup = page.locator('//div[@role="alert"]')
        this.newPasswordReset = page.locator('//input[@name="newPassword"]')
        this.passwordVerificationToReset = page.locator('//input[@name="confirmNewPassword"]')
        this.passwordResetButton = page.locator('//button[@type="submit"]')
        this.cancelation = page.locator(`//*[contains(text(), 'ביטול')]`);
        this.initPage();
    }


    fillEmployeeName = async (employeeName: string) => {
        await this.searchBar.fill(employeeName)
    }

    checkIfEmployeeNameIsExist = async (employeeName: string): Promise<boolean> => {
        const count = await this.employeesList.count()
        for (let i = 0; i < count; i++) {
            if (await this.employeesList.nth(i).innerText() === employeeName) {

                return true;
            }
        }
        return false;
    }

    clickOnAddingNewEmployeeButton = async () => {
        await this.newUserLink.click()
    }

    checkIfEmployeeNameExistAndDeleteIt = async (employeeName: string, oper: string) => {
        const count = await this.employeesList.count();
        for (let i = 0; i < count; i++) {
            if (await this.employeesList.nth(i).innerText() === employeeName) {

                await this.deleteTheEmployeeWeAreAdding(oper)
                await this.page.waitForTimeout(1000)
                return `Employee ${employeeName} exists at index ${i}`;
            }
        }
        return null; // Employee not found
    }

    deleteTheEmployeeWeAreAdding = async (oper: string) => {
        await this.employeesList.nth(6).click()
        await this.selectOperations(oper)
        await this.page.waitForTimeout(1000)
        await this.selectYesButtonPopup()

    }

    selectOperations = async (operations: string) => {
        const element = await this.page.$('//div[@class="MuiPaper-root MuiPaper-elevation MuiPaper-rounded MuiPaper-elevation8 MuiPopover-paper MuiMenu-paper MuiMenu-paper rtl-75edeq"]');

        if (element) {
            const listOfOperations = await element.$$('li');

            let targetElement = null;
            for (const oper of listOfOperations) {
                const text = await oper.textContent();
                if (text === operations) {
                    targetElement = oper;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This operations "${operations}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    selectYesButtonPopup = async () => {
        await this.yesButtonPopup.click()
    }

    selectNoButtonPopup = async () => {
        await this.noButtonPopup.click()
    }

    validateMinimumLength = async (input: string, minLength: number): Promise<boolean> => {
        return input.length >= minLength;
    }

    fillNewPasswordToReset = async (newPasswordToReset: string) => {
        const isValid = await this.validateMinimumLength(newPasswordToReset, 6); // Validate input length
        if (!isValid) {
            console.error(`Input must be at least 6 characters long.`);
            return;
        }
        await this.newPasswordReset.fill(newPasswordToReset);
    }

    fillPasswordVerificationToReset = async (passVerification: string) => {
        const isValid = await this.validateMinimumLength(passVerification, 6); // Validate input length
        if (!isValid) {
            console.error(`Input must be at least 6 characters long.`);
            return;
        }
        await this.passwordVerificationToReset.fill(passVerification);
    }

    selectEmployeeAndResetPassword = async (empName: string, oper: string, newPass: string, passVerif: string) => {
        await this.checkIfEmployeeNameIsExist(empName);
        await this.page.waitForTimeout(1000)
        await this.employeesList.nth(6).click()
        await this.page.waitForTimeout(1000)
        await this.selectOperations(oper);
        await this.fillNewPasswordToReset(newPass);
        await this.fillPasswordVerificationToReset(passVerif);
        await this.passwordResetButton.click();
        // await this.cancelation.click();
        await this.page.waitForTimeout(4000)

    }

    checkIfAlertContainsText = async (expectedText: string): Promise<boolean> => {
        try {
            await this.page.waitForSelector('//div[@role="alert"]', { state: 'visible', timeout: 10000 });

            // Get the text content of the alert popup
            const alertText: string | null = await this.alertPopup.innerText();

            // Check if the alert popup text contains the expected text
            return alertText !== null && alertText.includes(expectedText);
        } catch (error) {
            console.error('Error while checking alert message visibility:', error);
            return false; 
        }
    }
}
