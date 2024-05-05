import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class PatientsListPage extends BasePage {

    private searchBar: Locator
    private patiensList: Locator
    private healthFundsField: Locator
    private healthFundsList: Locator
    linkByHref: (hrefValue: any) => Locator;
    private addNewPatientLink: Locator;
    private operationsInPatientPage: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('//input[@type="search"]');
        this.patiensList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.healthFundsField = page.locator('//input[@id="Auto_Complete_Filter"]');
        this.healthFundsList = page.locator('//ul[@class="MuiAutocomplete-listbox rtl-1ll4iij"]');
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.addNewPatientLink = this.linkByHref('/app/patient/new');
        this.operationsInPatientPage = page.locator('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]')
        this.initPage();
    }


    fillPatientNameInSearchField = async (patientName: string) => {
        await this.searchBar.fill(patientName)
    }

    checkIfPatientNameIsExist = async (patienName: string): Promise<boolean> => {
        const count = await this.patiensList.count()
        for (let i = 0; i < count; i++) {
            if (await this.patiensList.nth(i).innerText() === patienName) {

                return true;
            }
        }
        return false;
    }

    clickOnHealthFunds = async () => {
        await this.healthFundsField.click();
    }

    selectHealthFunds = async (healthFunds: string) => {
        const element = await this.page.$('//ul[@class="MuiAutocomplete-listbox rtl-1ll4iij"]');

        if (element) {
            const listOfOperations = await element.$$('li');

            let targetElement = null;
            for (const oper of listOfOperations) {
                const text = await oper.textContent();
                if (text === healthFunds) {
                    targetElement = oper;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This operations "${healthFunds}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    performSelctingFromHealthFundList = async (operHealthFundToSelect: string) => {
        await this.clickOnHealthFunds();
        await this.page.waitForTimeout(1000);
        await this.selectHealthFunds(operHealthFundToSelect);
    }

    checkIfHealthFundsNameIsExist = async (healthFunds: string): Promise<boolean> => {

        await this.page.waitForTimeout(1000);
        const count = await this.patiensList.count();
        let foundCount = 0; // Counter for found health fund names
        let targetFound = false; // Flag to track if the target health fund name is found

        for (let i = 3; i < count; i += 7) {
            const fundName = await this.patiensList.nth(i).innerText();
            if (fundName === healthFunds) {
                targetFound = true; // Set the flag to true if the target name is found
                continue;
            }
            console.log(`Found another health fund name: ${fundName}`); // Print the found name
            foundCount++; // Increment the counter for other names
        }

        console.log(`Total found another health fund names: ${foundCount}`); // Print the total count of other names
        if (targetFound) {
            console.log(`The target health fund name "${healthFunds}" is found.`);
        } else {
            console.log(`The target health fund name "${healthFunds}" is not found.`);
        }
        return foundCount === 0 && targetFound; // Return true if only the target name is found, false otherwise
    }


    clickOnAddingNewPatientButton = async () => {
        await this.addNewPatientLink.click()
    }

    selectOperationsInPatientPage = async (operations: string) => {
        const element = await this.page.$(this.operationsInPatientPage.toString());

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
}