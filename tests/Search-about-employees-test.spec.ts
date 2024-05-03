import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { EmployeeList } from "../logic/employee-list-page";
import { AddingEmployeePage } from "../logic/adding-employee-page";
import { employeeProfilePage } from "../logic/employee-profile-page";

test.describe('Searching about employee', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl);
        // await browser.maximizeWindow();
        const employeesPage = new SidebarPage(page);
        await employeesPage.clickOnEmployeesIcon();
    });

    test.afterEach(async () => {
        // const tearDown = new EmployeeList(page) 
        // await tearDown.checkIfEmployeeNameExistAndDeleteIt(config.employeeWeAreLookingFor.fullName, config.Operations.employeeBlocking) //employee has been removed
        // await page.waitForTimeout(1000)
        await browser.closeBrowser();
    });

    test('Search for a specific employee and verify whether he is found or not', async () => {
        const searchFromEmployeeList = new EmployeeList(page);
        await searchFromEmployeeList.fillEmployeeName(config.employees.employee36);
        await page.waitForTimeout(2000)
        expect(await searchFromEmployeeList.checkIfEmployeeNameIsExist(config.employees.employee36)).toBeTruthy();
    });

    test('adding new employee & verify if the new employee is added', async () => {
        const navigateToAddNewEmployee = new EmployeeList(page);
        await navigateToAddNewEmployee.clickOnAddingNewEmployeeButton();
        const addNewEmployee = new AddingEmployeePage(page);
        await addNewEmployee.makeNewEmployee
            (config.addNewEmployee.firstName, config.addNewEmployee.lastName, config.addNewEmployee.email,
                config.addNewEmployee.password, config.addNewEmployee.passwordVerification,
                config.addNewEmployee.id, config.addNewEmployee.visitRate, config.addNewEmployee.professionalLicenseNumber,
                config.authorizationType.systemManager, config.role.doctor, config.addNewEmployee.roleDescription,
                config.addNewEmployee.employeeNumber, config.addNewEmployee.startDate, config.addNewEmployee.completionDate,
                config.addNewEmployee.birthday, config.addNewEmployee.phoneNumber, config.addNewEmployee.anotherPhone,
                config.maritalStatus.Married, config.addNewEmployee.address, config.gender.male)
        expect(await addNewEmployee.checkIfSpecificEmployeeIsExist(config.employeeWeAreLookingFor.fullName)).toBeTruthy();
        // await page.waitForTimeout(5000)
    });

    test('Verify if the new employee we added has been deleted', async () => {
        const makeSureItIsDeleted = new EmployeeList(page);
        await page.waitForTimeout(1000);
        await makeSureItIsDeleted.checkIfEmployeeNameExistAndDeleteIt(config.employeeWeAreLookingFor.fullName, config.Operations.employeeBlocking)
        const employeeExists = await makeSureItIsDeleted.checkIfEmployeeNameIsExist(config.employeeWeAreLookingFor.fullName);
        expect(employeeExists).toBe(false);
    });


    test('search about employee & Verify if alert contains the word "password changed successfully"', async () => {
        const alert = new EmployeeList(page);
        await alert.selectEmployeeAndResetPassword(config.employees.hmodekanaan, config.Operations.passwordReset,
            config.passwordReset.newPassword, config.passwordReset.verifPassword)
        const isAlertSuccessful = await alert.checkIfAlertContainsText('סיסמה שונתה בהצלחה');
        expect(isAlertSuccessful).toBe(true);
    });


    test('Selecting an employee and entering in his profile to update the details & verify whether an update has been made in employee details container', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile("mohamed absr", "mohamed absr");
        const newUpdate = new AddingEmployeePage(page)
        await newUpdate.makeClearAllInTheField()
        await newUpdate.makeTheNewUpdateForTheEmployeeDetails(config.employeeProfileToUpdate.emailForChange,
            config.employeeProfileToUpdate.phoneNumberForChange, config.gender.female, "mohamed absr", "mohamed absr")
        const updateDetails = new employeeProfilePage(page)
        await page.waitForTimeout(1000)
        expect(await updateDetails.compareNameInPTag("נקבה")).toBeTruthy();
    });

    test('Selecting an employee and entering in his profile to update the details & Verify if alert contains the word "Report updated successfully"', async () => {
        const newTest = new EmployeeList(page);
        await newTest.selectingEmployeeToEnterTheirProfile("mohamed absr", "mohamed absr");
        const newUpdate = new AddingEmployeePage(page)
        await newUpdate.makeClearAllInTheField()
        await newUpdate.makeTheNewUpdateForTheEmployeeDetails(config.employeeProfileToUpdate.emailForChange,
            config.employeeProfileToUpdate.phoneNumberForChange, config.gender.male, "", "")
        const isAlertSuccessful2 = await newTest.checkIfAlertContainsText('דוח עודכן בהצלחה');
        expect(isAlertSuccessful2).toBe(true);
    });
})