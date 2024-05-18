import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { EmployeeList } from "../logic/employee-list-page";
import { AddingEmployeePage } from "../logic/adding-employee-page";
import { employeeProfilePage } from "../logic/employee-profile-page";

test.describe('Employee list page', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl);
        const employeesPage = new SidebarPage(page);
        await employeesPage.clickOnEmployeesIcon();
    });

    test.afterEach(async () => {
        await browser.closeBrowser();
    });


    test.describe('Navigation to the correct page ', () => {

        test('verify Navigation to the list of employees page.', async () => {
            const employeeList = new EmployeeList(page)
            expect(await employeeList.getPageTitle()).toContain('רשימת עובדים')
        });


        test('When an employee is selected, we verify that we are directed to the profile of the selected employee.', async () => {
            const employeeList = new EmployeeList(page)
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36, "")
            const employeProfile = new employeeProfilePage(page)
            expect(await employeProfile.getPageTitle()).toContain('פרופיל עובד')
        });

        test('Verify that on clicking the button  " add a new employee ", you are directed to the correct page.', async () => {
            const employeeList = new EmployeeList(page)
            await employeeList.clickOnAddingNewEmployeeButton()
            const addingEmployee = new AddingEmployeePage(page)
            expect(await addingEmployee.getPageTitle()).toContain('הוספת עובד')
        });
    });


    test.describe('search inputs tests cases', () => {

        test('search for a employee by name', async () => {
            const employeeList = new EmployeeList(page);
            await employeeList.fillEmployeeName(config.employees.employee36);
            await page.waitForTimeout(2000);
            expect(await employeeList.checkIfEmployeeNameIsExist(config.employees.employee36)).toBeTruthy();
        });
    });



    test.describe('adding new employee ', () => {

        test('adding new employee & verify if the new employee is added', async () => {
            const employeeList = new EmployeeList(page);
            await employeeList.clickOnAddingNewEmployeeButton();
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
        });
    });



    test.describe('operations', () => {

        test('Verify if the new employee we added has been deleted', async () => {
            const employeeList = new EmployeeList(page);
            await page.waitForTimeout(1000);
            await employeeList.checkIfEmployeeNameExistAndDeleteIt(config.employeeWeAreLookingFor.fullName, config.OperationsInEmployeesPage.employeeBlocking)
            const employeeExists = await employeeList.checkIfEmployeeNameIsExist(config.employeeWeAreLookingFor.fullName);
            expect(employeeExists).toBe(false);
        });


        test('Selects a employee & checks a password reset operation"', async () => {
            const employeeList = new EmployeeList(page);
            await employeeList.selectEmployeeAndResetPassword(config.employees.employee36, config.OperationsInEmployeesPage.passwordReset,
                config.passwordReset.newPassword, config.passwordReset.verifPassword)
            const isAlertSuccessful = await employeeList.checkIfAlertContainsText('סיסמה שונתה בהצלחה');
            expect(isAlertSuccessful).toBe(true);
        });


        test('Select an employee and perform an update on their details.', async () => {
            const employeeList = new EmployeeList(page);
            await employeeList.SelectAnEmployeeAndUpdateTheirDetails(config.employees.employee36, config.employees.employee36, config.OperationsInEmployeesPage.update)
            const newUpdate = new AddingEmployeePage(page)
            await newUpdate.makeClearAllInTheFieldAboutListPage()
            await newUpdate.makeTheNewUpdateForTheEmployeeDetails(config.employeeProfileToUpdate.emailForChange,
                config.employeeProfileToUpdate.phoneNumberForChange, config.gender.female, "", "")
            const isAlertSuccessful2 = await employeeList.checkIfAlertContainsText('דוח עודכן בהצלחה');
            expect(isAlertSuccessful2).toBe(true);

            //**************************************************\\
            //       Request failed with status code 500
            //**************************************************\\
        });


    });







    test.describe('table actions', () => {

        test('Search for a specific employee and verify if they exist in the employee list', async () => {
            const employeeList = new EmployeeList(page);
            // await employeeList.checkIfEmployeeNameExist(config.employees.employee36)
            await page.waitForTimeout(2000)
            expect(await employeeList.checkIfEmployeeNameExist(config.employees.employee36)).toBeTruthy();
            // expect(await employeeList.checkIfEmployeeNameExist('asasasas')).toBeTruthy();
        });
    });



    //alerts






});
