import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class AddingEmployeePage extends BasePage {
    private firstName: Locator;
    private lastName: Locator;
    private email: Locator;
    private password: Locator;
    private PasswordVerification: Locator;
    private id: Locator;
    private visitRate: Locator;
    private professionalLicenseNumber: Locator;
    private AuthorizationTypeField: Locator;
    private roleField: Locator;
    private roleDescription: Locator;
    private employeeNumber: Locator;
    private startDate: Locator;
    private completionDate: Locator;
    private birthday: Locator;
    private phoneNumber: Locator;
    private anotherPhone: Locator;
    private maritalStatusField: Locator;
    private address: Locator;
    private genderField: Locator;
    private submitButton: Locator;
    private backToPreviousPage: Locator;
    private employeesList: Locator;


    constructor(page: Page) {
        super(page);
        this.firstName = page.locator('//input[@name="personalDetails.firstName"]');
        this.lastName = page.locator('//input[@name="personalDetails.lastName"]');
        this.email = page.locator('//input[@type="email"]');
        this.password = page.locator('//input[@type="password"]').first();
        this.PasswordVerification = page.locator('//input[@type="password"]').last();
        this.id = page.locator('//input[@name="idNumber"]');
        this.visitRate = page.locator('//input[@name="visitRate"]');
        this.professionalLicenseNumber = page.locator('//input[@name="licenseNumber"]');
        this.AuthorizationTypeField = page.locator('//div[@id="mui-component-select-role"]');
        this.roleField = page.locator('//div[@id="mui-component-select-position"]');
        this.roleDescription = page.locator('//input[@name="positionDescription"]');
        this.employeeNumber = page.locator('//input[@name="employeeNumber"]');
        this.startDate = page.locator('//input[@type="tel"]').first();
        this.completionDate = page.locator('//input[@type="tel"]').nth(1);
        this.birthday = page.locator('//input[@type="tel"]').last();
        this.phoneNumber = page.locator('//input[@name="personalDetails.primaryPhone"]');
        this.anotherPhone = page.locator('//input[@name="personalDetails.secondaryPhone"]');
        this.maritalStatusField = page.locator('//div[@id="mui-component-select-personalDetails.martialStatus"]');
        this.address = page.locator('//input[@name="personalDetails.address"]');
        this.genderField = page.locator('//div[@id="mui-component-select-personalDetails.gender"]');
        this.submitButton = page.locator('//button[@type="submit"]');
        this.backToPreviousPage = page.locator('//button[@type="button"]').last();
        this.employeesList = page.locator('//td[@class="MuiTableCell-root MuiTableCell-body MuiTableCell-sizeMedium rtl-8epd4k"]');
        this.initPage();
    }


    fillFirstName = async (fName: string) => {
        await this.firstName.fill(fName)
    }

    fillLastName = async (lName: string) => {
        await this.lastName.fill(lName)
    }

    fillEmail = async (ema: string) => {
        await this.email.fill(ema)
    }

    fillPassword = async (pass: string) => {
        await this.password.fill(pass)
    }

    fillPasswordVerification = async (passVerification: string) => {
        await this.PasswordVerification.fill(passVerification)
    }

    fillId = async (id: string) => {
        await this.id.fill(id)
    }

    fillVisitRate = async (visitRate: string) => {
        await this.visitRate.fill(visitRate)
    }

    fillProfessionalLicenseNumber = async (profLicenseNumber: string) => {
        await this.professionalLicenseNumber.fill(profLicenseNumber)
    }

    clickToAuthorizationTypeField = async () => {
        await this.AuthorizationTypeField.click()
        // await this.page.waitForTimeout(1000)

    }

    selectAuthorizationType = async (authorizationType: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {
            const listOfAuthorizationType = await element.$$('li');

            let targetElement = null;
            for (const auth of listOfAuthorizationType) {
                const text = await auth.textContent();
                if (text === authorizationType) {
                    targetElement = auth;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`authEmployee "${authorizationType}" not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }

    }

    clickToRoleField = async () => {
        await this.roleField.click()
    }

    selectRole = async (roleToSelect: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {

            const listOfRoles = await element.$$('li');

            let targetElement = null;
            for (const role of listOfRoles) {
                const text = await role.textContent();
                if (text === roleToSelect) {
                    targetElement = role;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This role "${roleToSelect}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }

    }

    fillRoleDescription = async (roleDesc: string) => {
        await this.roleDescription.fill(roleDesc)
    }

    fillEmployeeNumber = async (employeeNum: string) => {
        await this.employeeNumber.fill(employeeNum)
    }

    fillStartDate = async (staDate: string) => {
        await this.startDate.fill(staDate)
    }

    fillCompletionDate = async (compDate: string) => {
        await this.completionDate.fill(compDate)
    }

    fillBirthday = async (bDaye: string) => {
        await this.birthday.fill(bDaye)
    }

    fillPhoneNumber = async (phoneNum: string) => {
        await this.phoneNumber.fill(phoneNum)
    }

    fillAnotherPhone = async (anotherNum: string) => {
        await this.anotherPhone.fill(anotherNum)
    }

    fillAddress = async (address: string) => {
        await this.address.fill(address)
    }

    clickToMaritalStatusField = async () => {
        await this.maritalStatusField.click()
    }

    selectOnMaritalStatus = async (maritalStatus: string) => {
        const element1 = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element1) {

            const listOfMaritalStatus = await element1.$$('li');
            let targetElement = null;
            for (const status of listOfMaritalStatus) {
                const text = await status.textContent();
                if (text === maritalStatus) {
                    targetElement = status;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This maritalStatus "${maritalStatus}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }

    }

    clickOnGenderField = async () => {
        await this.genderField.click()
    }

    selectGender = async (gender: string) => {
        const element2 = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element2) {

            const listOfGender = await element2.$$('li');

            let targetElement = null;
            for (const gend of listOfGender) {
                const text = await gend.textContent();
                if (text === gender) {
                    targetElement = gend;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`This gender "${gender}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    clickOnSubmitButton = async () => {
        await this.submitButton.click()
    }

    clickOnBackToPreviousPage = async () => {
        await this.backToPreviousPage.click()
    }

    makeNewEmployee = async (firstName: string, lastName: string, email: string, pass: string, passVer: string, id: string,
        visRate: string, profLicenseNumber: string, authType: string, roles: string, roelDes: string, empNum: string, sDate: string,
        compDate: string, birthDay: string, phoNum: string, anothPhone: string, maritalStatus: string, address: string, gender: string) => {
        await this.fillFirstName(firstName);
        await this.fillLastName(lastName);
        await this.fillEmail(email);
        await this.fillPassword(pass);
        await this.fillPasswordVerification(passVer);
        await this.fillId(id);
        await this.fillVisitRate(visRate);
        await this.fillProfessionalLicenseNumber(profLicenseNumber);
        await this.clickToAuthorizationTypeField();
        await this.selectAuthorizationType(authType);
        await this.clickToRoleField()
        await this.selectRole(roles)
        await this.fillRoleDescription(roelDes)
        await this.fillEmployeeNumber(empNum)
        await this.fillStartDate(sDate)
        await this.fillCompletionDate(compDate)
        await this.fillBirthday(birthDay)
        await this.fillPhoneNumber(phoNum)
        await this.fillAnotherPhone(anothPhone)
        await this.clickToMaritalStatusField()
        await this.selectOnMaritalStatus(maritalStatus)
        await this.fillAddress(address)
        await this.clickOnGenderField()
        await this.selectGender(gender)
        await this.clickOnSubmitButton()
    }

    checkIfSpecificEmployeeIsExist = async (employeeWeAreLookingFor: string): Promise<boolean> => {

        await this.page.waitForTimeout(2000)
        const count = await this.employeesList.count()
        for (let i = 0; i < count; i += 7) {
            if (await this.employeesList.nth(i).innerText() === employeeWeAreLookingFor) {

                return true
            }
        }
        return false
    }
}
