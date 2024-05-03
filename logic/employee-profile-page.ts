import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class employeeProfilePage extends BasePage {

    private editingDetails: Locator
    private passwordReset: Locator
    private blockingEmployee: Locator

    constructor(page: Page) {
        super(page);
        this.editingDetails = page.locator(`//*[contains(text(), 'עריכת פרטים')]`);
        this.passwordReset = page.locator('//button[@type="button"]').nth(2);
        this.blockingEmployee = page.locator('//button[@type="button"]').nth(3);
        this.initPage();
    }

    selectEditingDetails = async () => {
        await this.editingDetails.click();
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
}