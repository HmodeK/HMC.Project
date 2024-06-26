import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class EmployeeList extends BasePage {
    private searchBar: Locator;
    private employeesList: Locator;
    private employeeStatusButton: Locator;/////////////////////////////////////////////  A question to check
    linkByHref: (hrefValue: any) => Locator;
    private newUserLink: Locator;
    private yesButtonPopup: Locator;
    // private noButtonPopup: Locator;
    private alertPopup: Locator;
    private newPasswordReset: Locator;
    private passwordVerificationToReset: Locator;
    private passwordResetButton: Locator;
    private cancelation: Locator;
    private employe: Locator;
    private employeeSearchResult: Locator;
    private pageTitle: Locator;
    private activityButton: Locator;
    private menuOfTheListButton: Locator;

    constructor(page: Page) {
        super(page);
        this.searchBar = page.locator('//input[@type="search"]');
        this.employeesList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.employe = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]').nth(0);
        this.employeeStatusButton = page.locator('//div[@aria-haspopup="listbox"]').first();
        this.linkByHref = (hrefValue) => this.page.locator(`a[href="${hrefValue}"]`);
        this.newUserLink = this.linkByHref('/app/user/new');
        this.yesButtonPopup = page.locator("//button[contains(text(), 'כן')]").first();
        // this.noButtonPopup = page.locator('//button[@type="button"]').nth(26)
        this.alertPopup = page.locator('//div[@role="alert"]')
        this.newPasswordReset = page.locator('//input[@name="newPassword"]')
        this.passwordVerificationToReset = page.locator('//input[@name="confirmNewPassword"]')
        this.passwordResetButton = page.locator('//button[@type="submit"]')
        this.cancelation = page.locator(`//*[contains(text(), 'ביטול')]`);
        this.employeeSearchResult = page.locator('//tbody[@class="MuiTableBody-root rtl-yvb2m1"]');
        this.pageTitle = page.locator('//h3[@class="MuiTypography-root MuiTypography-h3 MuiTypography-gutterBottom rtl-1n929hu"]');
        this.activityButton = page.locator('//div[@role="combobox"]').first();
        this.menuOfTheListButton = page.locator('//div[@aria-haspopup="listbox"]').last(); ////ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]
        this.initPage();
    }

    getPageTitle = async (): Promise<string> => {
        await this.page.waitForTimeout(1000);
        const title = await this.pageTitle.innerText();
        console.log(`Page Title: ${title}`);
        return title;
    }
    

    fillEmployeeName = async (employeeName: string) => {
        await this.searchBar.fill(employeeName)
    }

    checkIfEmployeeNameIsExist = async (employeeName: string): Promise<boolean> => {
        await this.page.waitForTimeout(1000);
        const count = await this.employeesList.count()
        await this.page.waitForTimeout(1000);

        for (let i = 0; i < count; i++) {
            if (await this.employeesList.nth(i).innerText() === employeeName) {
                console.log(`Employee ${employeeName} exists at index ${i}`);;
                return true;
            }
        }
        console.log(`Employee ${employeeName} is not found`); // Employee not found)
        return false;
    }

    clickOnAddingNewEmployeeButton = async () => {
        await this.newUserLink.click();
        await this.page.waitForTimeout(2000);
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

    // selectNoButtonPopup = async () => {    // כרגע לא בשימוש
    //     await this.noButtonPopup.click()
    // }

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
        await this.fillEmployeeName(empName)
        await this.checkIfEmployeeNameIsExist(empName);
        await this.page.waitForTimeout(1000)
        await this.employeesList.nth(6).click()
        await this.page.waitForTimeout(1000)
        await this.selectOperations(oper);
        await this.fillNewPasswordToReset(newPass);
        await this.fillPasswordVerificationToReset(passVerif);
        await this.passwordResetButton.click();
        // await this.cancelation.click();
        await this.page.waitForTimeout(2000)

    }

    checkIfAlertContainsText = async (expectedText: string): Promise<boolean> => {
        try {
            await this.page.waitForSelector('//div[@role="alert"]', { state: 'visible', timeout: 10000 });

            // Get the text content of the alert popup
            const alertText: string | null = await this.alertPopup.innerText();

            // Check if the alert popup text contains the expected text
            const result = alertText !== null && alertText.includes(expectedText);

            // Print the actual alert text content
            console.log(`Actual Alert Text: ${alertText}`);

            // Print the result
            console.log(`Alert contains expected text: ${result}`);

            return result;
        } catch (error) {
            console.error('Error while checking alert message visibility:', error);

            // Print the error and return false
            console.log('Result: false (Error occurred)');
            return false;
        }
    }

    selectEmployee = async () => {
        await this.employe.click()
    }

    selectingEmployeeToEnterTheirProfile = async (employeeName: string, employeeDetailIsExist?: string): Promise<boolean> => {
        try {
            await this.fillEmployeeName(employeeName);
            await this.page.waitForTimeout(2000);
    
            if (employeeDetailIsExist) {
                const detailsExist = await this.checkIfEmployeeDetailsIsExist(employeeDetailIsExist);
                if (!detailsExist) {
                    console.error(`Employee details "${employeeDetailIsExist}" not found.`);
                    return false; // Exit function if details are not found
                }
            }
    
            await this.selectEmployee();
            await this.page.waitForTimeout(1000);
            return true; // Operation successful
        } catch (error) {
            console.error(`Error in selecting employee profile: ${error}`);
            return false; // Operation failed
        }
    }
    


    SelectAnEmployeeAndUpdateTheirDetails = async (empName: string, employIsExist: string, oper: string) => {
        await this.fillEmployeeName(empName);
        await this.page.waitForTimeout(1000);
        await this.checkIfEmployeeDetailsIsExist(employIsExist);
        await this.employeesList.nth(6).click();
        await this.page.waitForTimeout(1000);
        await this.selectOperations(oper);
        await this.page.waitForTimeout(1000);

    }

    selectEmployeeStatus = async (emloyeStatus: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {

            const listOfEmployeeStatus = await element.$$('li');
            let targetElement = null;
            for (const status of listOfEmployeeStatus) {
                const text = await status.textContent();
                if (text === emloyeStatus) {
                    targetElement = status;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This status "${emloyeStatus}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }

    }
    checkIfEmployeeDetailsIsExist = async (employeeDetail1: string): Promise<boolean> => {
        const count = await this.employeeSearchResult.count()
        for (let i = 0; i < count; i++) {
            if (await this.employeeSearchResult.nth(i).innerText() === employeeDetail1) {
                await this.page.waitForTimeout(2000)
                return true;
            }
        }
        return false;
    }


    checkIfEmployeeIsExistToSearchAgainInAnotherActivityStatus = async (employeeDetail1: string, emStatus: string): Promise<boolean> => {
        const count = await this.employeeSearchResult.count();
        let found = false; // Flag to track if employee is found

        for (let i = 0; i < count; i++) {
            if (await this.employeeSearchResult.nth(i).innerText() === employeeDetail1) {
                console.log('The employee is here and not blocked');
                found = true; // Set flag to true if employee is found
                break; // Exit the loop when employee is found
            }
        }

        if (!found) {
            // await this.page.waitForTimeout(1000);
            await this.employeeStatusButton.click();
            await this.selectEmployeeStatus(emStatus);
            await this.page.waitForTimeout(1000);
            // Search for the employee detail again
            const updatedCount = await this.employeeSearchResult.count();
            for (let i = 0; i < updatedCount; i++) {
                if (await this.employeeSearchResult.nth(i).innerText() === employeeDetail1) {
                    await this.page.waitForTimeout(2000);
                    return true;
                }
            }
        }

        return found;
    }

    performSearchForTheEmployeeAgainToChangeTheirActivityStatus = async (empNa: string, empNa2: string, emStatus: string, operation: string) => {
        await this.fillEmployeeName(empNa);
        await this.page.waitForTimeout(2000)
        await this.checkIfEmployeeIsExistToSearchAgainInAnotherActivityStatus(empNa2, emStatus);
        await this.employeesList.nth(6).click()
        await this.page.waitForTimeout(1000)
        await this.selectOperations(operation);
        await this.page.waitForTimeout(1000)
        await this.selectYesButtonPopup()
    }

    clickOnActivityButton = async () => {
        await this.activityButton.click();
    }


    performCheckForTheEmployeesActivity = async (emStatus?: string) => {

        if (emStatus) {
            await this.clickOnActivityButton();
            await this.selectEmployeeStatus(emStatus);
        }

        await this.page.waitForTimeout(1000);
        await this.employeesList.nth(6).click();
        await this.page.waitForTimeout(3000);
    }

    checkTextContent = async (expectedText: string): Promise<boolean> => {
        const element = await this.page.$('//p[@class="MuiTypography-root MuiTypography-body2 MuiListItemText-primary rtl-vk5so8"]');
        if (element) {
            const textContent = await element.textContent();
            console.log(`Text content found: ${textContent}`);
            return textContent === expectedText;
        } else {
            console.log('Element not found.');
            return false;
        }
    };


    getFilterButtonText = async (employeeStatus?: string): Promise<string> => {
        if (employeeStatus) {
            await this.clickOnActivityButton();
            await this.page.waitForTimeout(1000);
            await this.selectEmployeeStatus(employeeStatus);
            await this.page.waitForTimeout(2000);
        }
        const buttonText = await this.activityButton.innerText();
        console.log('The filter button text that is Received:', buttonText);

        // Check if the returned text exactly matches "לא פעיל" or "פעיל"
        if (buttonText === "לא פעיל") {
            console.log('Filter button text is "לא פעיל".');
        } else if (buttonText === "פעיל") {
            console.log('Filter button text is "פעיל".');
        } else {
            console.log('Filter button text does not match expected values.');
        }

        return buttonText;
    }

    filterListByNumberOfMenu = async (menuNumber: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {

            const listOfMenuNumber = await element.$$('li');
            let targetElement = null;
            for (const status of listOfMenuNumber) {
                const text = await status.textContent();
                if (text === menuNumber) {
                    targetElement = status;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This menuNumber "${menuNumber}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }

    }

    clickOnMenuNumberButton = async () => {
        await this.page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });
        await this.menuOfTheListButton.click();
    }

    chooseMenuNumber = async (menuNum: number) => {
        await this.clickOnMenuNumberButton();
        await this.filterListByNumberOfMenu(menuNum.toString());
        await this.page.waitForTimeout(1000);

    }

    howManyEmployeeInTheList = async () => {
        const element = await this.page.$('//tbody[@class="MuiTableBody-root rtl-yvb2m1"]');

        if (element) {
            const listOfEmployees = await element.$$('tr');
            const employeeCount = listOfEmployees.length;
            console.log(`Number of employees in the list: ${employeeCount}`);
            return employeeCount;

        } else {
            throw new Error(`The element representing the employee list is not found.`);
        }
    }
}