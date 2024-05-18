import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class PatientsListPage extends BasePage {

    private searchBar: Locator
    private patiensList: Locator
    private healthFundsField: Locator
    private healthFundsList: Locator
    linkByHref: (hrefValue: any) => Locator;
    private addNewPatientLink: Locator;
    private yesButtonPopup: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('//input[@type="search"]');
        this.patiensList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.healthFundsField = page.locator('//input[@id="Auto_Complete_Filter"]');
        this.healthFundsList = page.locator('//ul[@class="MuiAutocomplete-listbox rtl-1ll4iij"]');
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.addNewPatientLink = this.linkByHref('/app/patient/new');
        this.yesButtonPopup = page.locator("//button[contains(text(), 'כן')]").first();

        this.initPage();
    }

    fillPatientNameInSearchField = async (patientName: string) => {
        await this.searchBar.fill(patientName)
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

    performSelctingFromClinicList = async (operHealthFundToSelect: string) => {
        await this.clickOnHealthFunds();
        await this.page.waitForTimeout(1000);
        await this.selectHealthFunds(operHealthFundToSelect);
    }

    checkIfClinicsNameIsExist = async (Clinic: string): Promise<boolean> => {

        await this.page.waitForTimeout(1000);
        const count = await this.patiensList.count();
        let foundCount = 0; // Counter for found Clinic names
        let targetFound = false; // Flag to track if the target Clinic name is found

        for (let i = 3; i < count; i += 7) {
            const fundName = await this.patiensList.nth(i).innerText();
            if (fundName === Clinic) {
                targetFound = true; // Set the flag to true if the target name is found
                continue;
            }
            console.log(`Found another Clinic name: ${fundName}`); // Print the found name
            foundCount++; // Increment the counter for other names
        }

        console.log(`Total found another Clinic names: ${foundCount}`); // Print the total count of other names
        if (targetFound) {
            console.log(`The target Clinic name "${Clinic}" is found.`);
        } else {
            console.log(`The target Clinic name "${Clinic}" is not found.`);
        }
        return foundCount === 0 && targetFound; // Return true if only the target name is found, false otherwise
    }


    clickOnAddingNewPatientButton = async () => {
        await this.addNewPatientLink.click()
    }

    selectOperationsInPatientPage = async (operations: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

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

    clickAndSelectFromOperationsIcon = async (opper: string) => {
        await this.patiensList.nth(6).click();
        await this.page.waitForTimeout(2000);
        await this.selectOperationsInPatientPage(opper);
    };

    checkIfSpecificPatientIsExist = async (patientWeAreLookingFor: string): Promise<boolean> => {
        await this.page.waitForTimeout(2000);
        const count = await this.patiensList.count();
        for (let i = 0; i < count; i++) {
            if (await this.patiensList.nth(i).innerText() === patientWeAreLookingFor) {
                console.log(`Patient "${patientWeAreLookingFor}" found.`);
                return true;
            }
        }
        console.log(`Patient "${patientWeAreLookingFor}" not found.`);
        return false;
    }

    selectYesButtonPopup = async () => {

        if (this.yesButtonPopup) {
            await this.yesButtonPopup.click();
        } else {
            console.error('Button not found');
        }


    }

    performPatientDelete = async (patientNam: string, operationFromPatientList: string) => {
        await this.checkIfSpecificPatientIsExist(patientNam);
        await this.clickAndSelectFromOperationsIcon(operationFromPatientList);
        await this.page.waitForTimeout(2000);
        await this.selectYesButtonPopup();
    }
}