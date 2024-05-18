import { BrowserWrapper } from "../infra/browser/browser-wrapper";
import { test, Page, expect } from '@playwright/test'
import urls from "../configFiles/urls.json"
import config from "../configFiles/config.json"
import { SidebarPage } from "../logic/sidebar-page";
import { PatientsListPage } from "../logic/patients-list-page";
import { AddingPatientPage } from "../logic/adding-patient-page";
import { EmployeeList } from "../logic/employee-list-page";

test.describe('Searching about employee & adding new employee', () => {
    let browser: BrowserWrapper;
    let page: Page;

    test.beforeEach(async () => {
        browser = new BrowserWrapper;
        page = await browser.getPage(urls.uiUrl.websiteUrl);
        // await browser.maximizeWindow();
        const entryToPatiensPage = new SidebarPage(page);
        await entryToPatiensPage.clickOnPatiensIcon()
    });

    test.afterEach(async () => {
        // await page.waitForTimeout(1000)
        await browser.closeBrowser();
    });

    test('Search about  patients && verify the name we are looking for is here', async () => {
        const searchAnPatiens = new PatientsListPage(page)
        await searchAnPatiens.fillPatientNameInSearchField('מטופל דגומה-457')
        await page.waitForTimeout(2000)
        expect(await searchAnPatiens.checkIfSpecificPatientIsExist('מטופל דגומה-457')).toBeTruthy();
    });

    test('Search for a clinic using (filter) && verify the name we are looking for is here', async () => {
        const searchAnHealthFund = new PatientsListPage(page)
        await searchAnHealthFund.performSelctingFromClinicList(config.healthFunds.meuhedet)
        expect(await searchAnHealthFund.checkIfClinicsNameIsExist(config.healthFunds.meuhedet)).toBeTruthy();
    });

    test('Adding a new patient && check if the new patient has been added >> Through the popup that pops up', async () => {
        const VerifyAlert = new EmployeeList(page);
        const searchInPatientList = new PatientsListPage(page)
        await searchInPatientList.clickOnAddingNewPatientButton()
        const addingPatient = new AddingPatientPage(page)
        await addingPatient.performAddingPatient(config.addingPatient.firstName, config.addingPatient.lastName,
            config.selectIdType.id, config.addingPatient.id, config.healthFunds.meuhedet, config.addingPatient.birthday,
            config.addingPatient.phoneNumber, config.addingPatient.anotherPhone, config.maritalStatus.Married, config.addingPatient.address,
            config.gender.male, config.contactDetails.firstName, config.contactDetails.lastName, config.contactDetails.phoneNumber);
        expect(await searchInPatientList.checkIfSpecificPatientIsExist(config.patientWeAreLookingFor.fullName)).toBeTruthy();
        const isAlertSuccessful2 = await VerifyAlert.checkIfAlertContainsText('דוח נקלט בהצלחה');
        expect(isAlertSuccessful2).toBe(true);
    });

    test('Verify if the new patient we added has been deleted >> (tested by a list)', async () => {
        const VerifyAlert2 = new EmployeeList(page);
        const makeSureItIsDeleted = new PatientsListPage(page);
        await makeSureItIsDeleted.performPatientDelete(config.patientWeAreLookingFor.fullName, config.OperationsInPatientPage.remove)
        const patientExists = await makeSureItIsDeleted.checkIfSpecificPatientIsExist(config.patientWeAreLookingFor.fullName);
        expect(patientExists).toBe(false);
        const isAlertSuccessful = await VerifyAlert2.checkIfAlertContainsText('דוח עודכן בהצלחה');
        expect(isAlertSuccessful).toBe(true);
    });
})