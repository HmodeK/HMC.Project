import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { EmployeeList } from "../logic/employee-list-page";
import { AddingEmployeePage } from "../logic/adding-employee-page";
import { EmployeeProfilePage } from "../logic/employee-profile-page";

test.describe('Selecting an employee & updating it', () => {
    let browser: BrowserWrapper;
    let page: Page;
    let isLastTest = false;


    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.employeesPage);
        // await browser.maximizeWindow();
        const employeesPage = new SidebarPage(page);
        await employeesPage.clickOnEmployeesIcon();

    });
    
    test.afterEach(async () => {
        if (isLastTest) {
            // Perform specific cleanup actions for the last test
            const employeesPage = new SidebarPage(page);
            await employeesPage.clickOnEmployeesIcon();
            const ReturningTheDeletedEmployeeToActive = new EmployeeList(page);
            await ReturningTheDeletedEmployeeToActive.performSearchForTheEmployeeAgainToChangeTheirActivityStatus("mohamed absr", "mohamed absr", config.activityStatus.inactive, config.OperationsWithInactiveStatus.becomeActive);
        }
        await browser.closeBrowser();
    });

    test('Select an employee, update their profile details, and verify the gender update in the details container', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile(config.employees.employee36,config.employees.employee36);
        const newUpdate = new AddingEmployeePage(page)
        await newUpdate.implementTheNewUpdateAboutGender(config.gender.female)
        const updateDetails = new EmployeeProfilePage(page)
        await page.waitForTimeout(1000)
        expect(await updateDetails.compareNameInPTag("נקבה")).toBeTruthy();
    });

    test.skip('Select an employee, update their profile details, and verify the "email" update in the details container & Verify if alert contains the word "Report updated successfully"', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile(config.employees.employee36,config.employees.employee36);
        const newUpdate = new AddingEmployeePage(page)
        await newUpdate.makeClearInTheEmailField()
        await newUpdate.implementTheNewUpdateAboutGender(config.employeeProfileToUpdate.emailForChange)
        const isAlertSuccessful2 = await newTest.checkIfAlertContainsText('דוח עודכן בהצלחה');
        expect(isAlertSuccessful2).toBe(true);
        //****/    \****\\   
        //***/       \***\\  
        //**/          \**\\
        //**************************************************/
        // Request failed with status code 500
        //**************************************************/
    });

    test('Selecting an employee and perform a password reset on the employees personal page & Verify if alert contains the word "Password changed successfully"', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile(config.employees.employee36,config.employees.employee36);
        const passReset = new EmployeeProfilePage(page)
        await passReset.performPasswordResetRandomNumbers();
        const alerIstSuccessfully = await newTest.checkIfAlertContainsText('סיסמה שונתה בהצלחה');
        // const alerIstSuccessfully = await newTest.checkIfAlertContainsText('סיסמה בהצלחה');
        expect(alerIstSuccessfully).toBe(true);
    });

    test('Selecting an employee & Verify if alert contains the word "password changed successfully"', async () => {
        const alert = new EmployeeList(page);
        await alert.selectEmployeeAndResetPassword(config.employees.employee36, config.OperationsInEmployeesPage.passwordReset,
            config.passwordReset.newPassword, config.passwordReset.verifPassword)
        const isAlertSuccessful = await alert.checkIfAlertContainsText('סיסמה שונתה בהצלחה');
        expect(isAlertSuccessful).toBe(true);
    });

    test('Selecting an employee and perform a block on the employees personal page && verify is the employee is blocked && Verify if alert contains the word "Report updated successfully"', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile("mohamed absr", "mohamed absr");
        const passReset = new EmployeeProfilePage(page)
        await passReset.performBlockForAnEmployee();
        const alerIstSuccessfully = await newTest.checkIfAlertContainsText('דוח עודכן בהצלחה');
        // const alerIstSuccessfully = await newTest.checkIfAlertContainsText('דוחלחה');
        expect(alerIstSuccessfully).toBe(true);
        isLastTest = true;
    });
})