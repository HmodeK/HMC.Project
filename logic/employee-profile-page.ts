import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";
import { EmployeeList } from "./employee-list-page";

export class employeeProfilePage extends BasePage {

    private editingDetailsButton: Locator
    private passwordResetButton: Locator
    private blockingEmployeeButton: Locator
    private passResetButton: Locator
    private yesButtonToBlock: Locator
    private pageTitleFromEmployeProfilePage: Locator

    constructor(page: Page) {
        super(page);
        this.editingDetailsButton = page.locator(`//*[contains(text(), 'עריכת פרטים')]`);
        this.passwordResetButton = page.locator('//button[@type="button"]').nth(2);
        this.blockingEmployeeButton = page.locator('//button[@type="button"]').nth(3);
        this.passResetButton = page.locator('//button[@type="submit"]');
        this.yesButtonToBlock = page.locator('//button[@type="button"]').nth(10);
        this.pageTitleFromEmployeProfilePage = page.locator('//h4[@class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom rtl-1bhrkuh"]');
        this.initPage();
    }


    getPageTitle = async (): Promise<string> => {
        return await this.pageTitleFromEmployeProfilePage.innerText()
    }

    selectEditingDetails = async () => {
        await this.editingDetailsButton.click();
    }

    compareNameInPTag = async (expectedName: string) => {
        const divs = await this.page.$$('//div[@class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-4 MuiGrid-grid-lg-4 rtl-19egsyp"]'); // Locate all div containers with the specified class

        for (const div of divs) {
            const pTags = await div.$$('p'); // Locate all <p> tags within the div

            for (const pTag of pTags) {
                const pText = await pTag.innerText();
                if (pText.trim() === expectedName) {
                    console.log(`Found the expected name "${expectedName}" in a <p> tag.`);
                    return true; // Return true if expected in any <p> tag
                }
            }
        }
        console.log(` OoOoPs , the expected name "${expectedName}" was not found .`);
        return false;
    }

    selectOnPasswordReset = async () => {
        await this.passwordResetButton.click();
    }


     generateRandomNumber=async() => {
        const min = 100000000; 
        const max = 999999999; 
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    performPasswordResetRandomNumbers = async () => {
        await this.selectOnPasswordReset();
        const newPas = new EmployeeList(this.page);
        const randomPass = await this.generateRandomNumber();
        await newPas.fillNewPasswordToReset(randomPass.toString()); // Convert the random number to string
        await newPas.fillPasswordVerificationToReset(randomPass.toString());
        await this.page.waitForTimeout(1000)
        await this.passResetButton.click();
    }

    selectOnBlockingEmployee = async () => {
        await this.blockingEmployeeButton.click();
    }

    selectOnYesButtonToBlock = async () => {
        await this.yesButtonToBlock.click()
    }

    performBlockForAnEmployee = async () => {
        await this.selectOnBlockingEmployee();
        await this.selectOnYesButtonToBlock();
        await this.page.waitForTimeout(3000)
    }
}