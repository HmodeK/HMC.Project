import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class EmployeeList extends BasePage {
    private searchBar: Locator;
    private employeesList: Locator;
    private employeeStatusButton: Locator;/////////////////////////////////////////////  A question to check
    linkByHref: (hrefValue: any) => Locator;
    private newUserLink: Locator;
    private yesButtonPopup: Locator;
    private noButtonPopup: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('//input[@type="search"]');
        this.employeesList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.employeeStatusButton = page.locator('//div[@aria-haspopup="listbox"]').first();
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.newUserLink = this.linkByHref('/app/user/new');
        this.yesButtonPopup = page.locator('//button[@type="button"]').nth(25)
        this.noButtonPopup = page.locator('//button[@type="button"]').nth(26)
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
        // await this.page.waitForTimeout(3000)
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
}