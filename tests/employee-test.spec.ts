import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { EmployeeList } from "../logic/employee-list-page";
import { AddingEmployeePage } from "../logic/adding-employee-page";
import { EmployeeProfilePage } from "../logic/employee-profile-page";
import { TestCleanup } from "../infra/utils/test-cleamup";

test.describe('Employee list page & profile page', () => {
    let browser: BrowserWrapper;
    let page: Page;
    let employeeList: EmployeeList;
    let addingEmployeePage: AddingEmployeePage;
    let employeeProfilePage: EmployeeProfilePage;
    let testCleanup: TestCleanup;
    let areTheDetailsUpdated = false;
    let isTheEmployeeAdded = false;
    let areTheMaritalIsUpdated = false;


    test.beforeEach(async () => {
        browser = new BrowserWrapper();
        page = await browser.getPage(urls.employeesPage);
        const sidebarPage = new SidebarPage(page);
        await sidebarPage.clickOnEmployeesIcon();
        employeeList = new EmployeeList(page);
        addingEmployeePage = new AddingEmployeePage(page);
        employeeProfilePage = new EmployeeProfilePage(page)
        testCleanup = new TestCleanup(addingEmployeePage, employeeList, employeeProfilePage);

    });
    
    test.afterEach(async () => {
        await testCleanup.performCleanup(areTheDetailsUpdated, isTheEmployeeAdded, areTheMaritalIsUpdated);
        await browser.closeBrowser();
    });


    test.describe('Verify that correctly navigates to the desired page and accurately displays the expected details ', () => {

        test('verify Navigation to the list of employees page.', async () => {
            expect(await employeeList.getPageTitle()).toContain('רשימת עובדים')
        });

        test('When an employee is selected, we verify that we are directed to the profile of the selected employee.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            expect(await employeeProfilePage.getPageTitle()).toContain('פרופיל עובד');
        });

        test('Verify that on clicking the button  " add a new employee ", you are directed to the correct page.', async () => {
            await employeeList.clickOnAddingNewEmployeeButton();
            expect(await addingEmployeePage.getPageTitle()).toContain('הוספת עובד');
        });

        test('Verify that selecting an employee redirects to their profile page and that their name is correctly displayed in the page title.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            expect(await employeeProfilePage.getEmployeeNameInTheTitle()).toContain('עובד employee 36')
        });


        test('Navigate to the appropriate page and verify the presence of the desired details within the container.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            expect(await employeeProfilePage.getEmployeeDetailInTheContainerOfDetails('עובד employee 36')).toBeTruthy()
        });

        test('Verify that clicking on {Edit Details} button redirects to their correctly editing page.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            const pageTitle = await employeeProfilePage.getTitleInEditingDetailsPage();
            expect(pageTitle).toBe('עריכת עובד עובד employee 36');
        });

        test('Verify that clicking on {Password Reset} button redirects to their password reset popup.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            const titleInPopup = await employeeProfilePage.getTitleInPasswordResetPopup();
            expect(titleInPopup).toBe('איפוס סיסמה');
        });

        test('Verify that clicking on {Employee Blocking} button redirects to their Employee Blocking popup.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            const titleInEmployeeBlockingPopup = await employeeProfilePage.getTitleInEmployeeBlockingPopup();
            expect(titleInEmployeeBlockingPopup).toBe('האם אתה בטוח שאתה רוצה לחסום עובד employee 36?');
        });
    });



    test.describe('search inputs tests cases', () => {

        test('search for a employee by name', async () => {
            await employeeList.fillEmployeeName(config.employees.employee36);
            expect(await employeeList.checkIfEmployeeNameIsExist(config.employees.employee36)).toBeTruthy();
        });
    });



    test.describe('Filter employees by status', () => {

        test('Filter employees & check whether the employees were filtered by >> inactive', async () => {
            await employeeList.performCheckForTheEmployeesActivity(config.activityStatus.inactive);
            const isTextFound = await employeeList.checkTextContent('הפוך לפעיל');
            expect(isTextFound).toBe(true);
        });

        test('Check if the employees are filtered by >> active', async () => {
            await employeeList.performCheckForTheEmployeesActivity();
            const isTextFound = await employeeList.checkTextContent('עדכן');
            expect(isTextFound).toBe(true);
        });

        test('Check if the filter button contains the desired text.>> active', async () => {
            expect(await employeeList.getFilterButtonText()).toContain('פעיל');
        });

        test('Check if the filter button contains the desired text.>> inactive', async () => {
            const buttonText = await employeeList.getFilterButtonText(config.activityStatus.inactive);
            expect(buttonText).toBe('לא פעיל');
            // expect(buttonText).toBe('פעיל');

        });
    });


    test.describe('adding new employee ', () => {

        test('adding new employee & verify if the new employee is added', async () => {
            await employeeList.clickOnAddingNewEmployeeButton();
            await addingEmployeePage.makeNewEmployee
                (config.addNewEmployee.firstName, config.addNewEmployee.lastName, config.addNewEmployee.email,
                    config.addNewEmployee.password, config.addNewEmployee.passwordVerification,
                    config.addNewEmployee.id, config.addNewEmployee.visitRate, config.addNewEmployee.professionalLicenseNumber,
                    config.authorizationType.systemManager, config.role.doctor, config.addNewEmployee.roleDescription,
                    config.addNewEmployee.employeeNumber, config.addNewEmployee.startDate, config.addNewEmployee.completionDate,
                    config.addNewEmployee.birthday, config.addNewEmployee.phoneNumber, config.addNewEmployee.anotherPhone,
                    config.maritalStatus.Married, config.addNewEmployee.address, config.gender.male)
            expect(await addingEmployeePage.checkIfSpecificEmployeeIsExist(config.employeeWeAreLookingFor.fullName)).toBeTruthy();
            isTheEmployeeAdded = true;
        });
    });

    test.describe('operations', () => {

        test('Verify if the new employee we added has been deleted', async () => {
            await employeeList.checkIfEmployeeNameExistAndDeleteIt(config.employeeWeAreLookingFor.fullName, config.OperationsInEmployeesPage.employeeBlocking)
            const employeeExists = await employeeList.checkIfEmployeeNameIsExist(config.employeeWeAreLookingFor.fullName);
            expect(employeeExists).toBe(false);
        });


        test('Selects a employee & check a password reset operation by "alert text" ', async () => {
            await employeeList.selectEmployeeAndResetPassword(config.employees.employee36, config.OperationsInEmployeesPage.passwordReset,
                config.passwordReset.newPassword, config.passwordReset.verifPassword)
            const isAlertSuccessful = await employeeList.checkIfAlertContainsText('סיסמה שונתה בהצלחה');
            expect(isAlertSuccessful).toBe(true);
        });


        test('Select an employee and perform an update on their details.', async () => {
            const isEmployeeExists = await employeeList.checkIfEmployeeNameIsExist(config.employees.employee36);
            // const isEmployeeExists = await employeeList.checkIfEmployeeNameIsExist('עובד employee 3');  // *** fail test ***

            if (isEmployeeExists) { // בדיקה האם העובד קיים ברשימה
                await employeeList.SelectAnEmployeeAndUpdateTheirDetails(config.employees.employee36, config.employees.employee36, config.OperationsInEmployeesPage.update);
                await addingEmployeePage.implementTheNewUpdateAboutGender(config.gender.female);
                const isAlertSuccessful = await employeeList.checkIfAlertContainsText('דוח עודכן בהצלחה');
                expect(isAlertSuccessful).toBe(true);
                areTheDetailsUpdated = true;
            } else {
                console.log('The employee does not exist in the list. Skipping update operation.');
                expect(!isEmployeeExists).toBeFalsy();  //מוודאים שהעובד באמת לא קיים ברשימה.
            }
        });

    });

    test.describe('table actions', () => {

        test('Search for a specific employee and verify if is exist in the employee list', async () => {
            const searchSpecificEmployee = await employeeList.checkIfEmployeeNameIsExist(config.employees.employee36);
            expect(searchSpecificEmployee).toBeTruthy();
            // expect(await employeeList.checkIfEmployeeNameIsExist('asasasas')).toBeTruthy(); // *** fail test ***
        });

        test('Filter the employee list to display only 20 entries, then verify the count of employees in the filtered list.', async () => {
            await employeeList.chooseMenuNumber(20);
            const employeeCount = await employeeList.howManyEmployeeInTheList();
            expect(employeeCount).toBe(20);
        });

    });

    test.describe('profile actions', () => {

        test('Verify that clicking on an employee link navigates to the employee list page.', async () => {
            await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
            await employeeProfilePage.clickOnEmployeeLink();
            const title = await employeeList.getPageTitle();
            expect(title).toBe('רשימת עובדים');
        });

        test('Verify that the selected employees details are updated correctly ..', async () => {
            const isEmployeeExists1 = await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36,);

            if (isEmployeeExists1) { // בדיקה האם העובד קיים ברשימה
                // await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
                await employeeProfilePage.selectEditingDetails();
                await addingEmployeePage.performUpdatingAboutMaritalStatus(config.maritalStatus.single)
                await employeeList.selectingEmployeeToEnterTheirProfile(config.employees.employee36);
                const updatesIsSuccessful = await employeeProfilePage.getEmployeeDetailInTheContainerOfDetails('רווק')
                expect(updatesIsSuccessful).toBe(true);
                areTheMaritalIsUpdated = true; //cleanup
            
            } else {
                console.log('The employee does not exist in the list. Skipping update operation.');
                expect(!isEmployeeExists1).toBeFalsy();  //מוודאים שהעובד באמת לא קיים ברשימה.
            }
        });


        test('Verify that clicking on an employee blocking button removes the employee from the list of employees.', async () => {
            await employeeList.activateEmployeeStatus(config.employeeWeAreLookingFor.fullName,config.activityStatus.inactive,config.employeeWeAreLookingFor.fullName);
            await employeeProfilePage.performBlockForAnEmployee();
            await employeeProfilePage.clickOnEmployeeLink()
            await page.waitForTimeout(4000)
            const isEmployeeExistsInTheList = await employeeList.checkIfEmployeeNameIsExist(config.employeeWeAreLookingFor.fullName);
            expect(isEmployeeExistsInTheList).toBe(false);
        });
    });

});