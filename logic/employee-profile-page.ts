import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";
import { EmployeeList } from "./employee-list-page";
import { AddingEmployeePage } from "./adding-employee-page";
import config from "../configFiles/config.json"


export class EmployeeProfilePage extends BasePage {

    private editingDetailsButton: Locator
    private passwordResetButton: Locator
    private blockingEmployeeButton: Locator
    private passResetButton: Locator
    private yesButtonToBlock: Locator
    private pageTitleFromEmployeProfilePage: Locator
    private employeeNameInTheTitle: Locator
    private titleInEditingDetailsPage: Locator
    private titleInPasswordResetPopup: Locator
    linkByHref: (hrefValue: any) => Locator;
    private userLink: Locator;

    constructor(page: Page) {
        super(page);
        this.editingDetailsButton = page.locator(`//*[contains(text(), 'עריכת פרטים')]`);
        this.passwordResetButton = page.locator('//button[@type="button"]').nth(2);
        this.blockingEmployeeButton = page.locator('//button[@type="button"]').nth(3);
        this.passResetButton = page.locator('//button[@type="submit"]');
        this.yesButtonToBlock = page.locator('//button[@type="button"]').nth(10);
        this.pageTitleFromEmployeProfilePage = page.locator('//h4[@class="MuiTypography-root MuiTypography-h4 MuiTypography-gutterBottom rtl-1bhrkuh"]');
        this.employeeNameInTheTitle = page.locator('//h6[@class="MuiTypography-root MuiTypography-subtitle2 rtl-i6b3hc"]');
        this.titleInEditingDetailsPage = page.locator('//h3[@class="MuiTypography-root MuiTypography-h3 rtl-1gx20ur"]');
        this.titleInPasswordResetPopup = page.locator('//h2[@id="alert-dialog-title"]');
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.userLink = this.linkByHref('/app/user').last();
        this.initPage();
    }


    getPageTitle = async (): Promise<string> => {
        const title = await this.pageTitleFromEmployeProfilePage.innerText();
        console.log(`Page Title: ${title}`);
        return title;
    }

    getEmployeeNameInTheTitle = async (): Promise<string> => {
        const employeeName = await this.employeeNameInTheTitle.innerText();
        console.log(`Employee Name in Title: ${employeeName}`);
        return employeeName;
    }


    getTitleInEditingDetailsPage = async (): Promise<string> => {
        await this.selectEditingDetails()
        await this.page.waitForTimeout(1000)
        const pageTitle = await this.titleInEditingDetailsPage.innerText();
        console.log(`Title in Editing Details Page: ${pageTitle}`);
        return pageTitle;
    }

    getTitleInPasswordResetPopup = async (): Promise<string> => {
        await this.selectOnPasswordReset()
        await this.page.waitForTimeout(1000)
        const titleInPopup = await this.titleInPasswordResetPopup.innerText();
        console.log(`Title in password reset popup: ${titleInPopup}`);
        return titleInPopup;
    }

    getTitleInEmployeeBlockingPopup = async (): Promise<string> => {
        await this.selectOnBlockingEmployee()
        await this.page.waitForTimeout(1000)
        const titleInPopup1 = await this.titleInPasswordResetPopup.innerText();
        console.log(`Title in employee blocking popup: ${titleInPopup1}`);
        return titleInPopup1;
    }


    getEmployeeDetailInTheContainerOfDetails = async (detailsOfEmployee: string) => {
        return await this.compareNameInPTag(detailsOfEmployee);
    }

    selectEditingDetails = async () => {
        await this.editingDetailsButton.click();
    }

    compareNameInPTag = async (expectedDetails: string) => {
        const divs = await this.page.$$('//div[@class="MuiGrid-root MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-4 MuiGrid-grid-lg-4 rtl-19egsyp"]'); // Locate all div containers with the specified class

        for (const div of divs) {
            const pTags = await div.$$('p'); // Locate all <p> tags within the div

            for (const pTag of pTags) {
                const pText = await pTag.innerText();
                if (pText.trim() === expectedDetails) {
                    console.log(`Found the expected name "${expectedDetails}" in a <p> tag.`);
                    return true; // Return true if expected in any <p> tag
                }
            }
        }
        console.log(` OoOoPs , the expected name "${expectedDetails}" was not found .`);
        return false;
    }

    selectOnPasswordReset = async () => {
        await this.passwordResetButton.click();
    }


    generateRandomNumber = async () => {
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
        await this.page.waitForTimeout(2000);
    }

    selectOnYesButtonToBlock = async () => {
        await this.yesButtonToBlock.click()
    }

    performBlockForAnEmployee = async () => {
        await this.selectOnBlockingEmployee(); 
        await this.selectOnYesButtonToBlock();
        await this.page.waitForTimeout(1000);

    }

    clickOnEmployeeLink = async () => {
        await this.userLink.click();
        await this.page.waitForTimeout(1000);

    }
}