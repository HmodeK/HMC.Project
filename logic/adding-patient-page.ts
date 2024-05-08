import { BasePage } from "../infra/browser/base-page";
import { ElementHandle, Locator, Page } from "playwright";

export class AddingPatientPage extends BasePage {

    private firstName: Locator
    private lastName: Locator
    private id: Locator;
    private helthFundsField: Locator;
    private birthday: Locator;
    private phoneNumber: Locator;
    private anotherPhone: Locator;
    private address: Locator;
    private listboxHasPopup: Locator;
    private contactsFirstName: Locator;
    private contactsLastName: Locator;
    private contactsPhoneNumber: Locator;
    private submit: Locator;
    private return: Locator;

    constructor(page: Page) {
        super(page);
        this.firstName = page.locator('//input[@name="personalDetails.firstName"]');
        this.lastName = page.locator('//input[@name="personalDetails.lastName"]');
        this.id = page.locator('//input[@name="idNumber"]');
        this.helthFundsField = page.locator('//input[@name="clinic"]');
        this.birthday = page.locator('//input[@placeholder="dd/mm/yyyy"]');
        this.phoneNumber = page.locator('//input[@name="personalDetails.primaryPhone"]');
        this.anotherPhone = page.locator('//input[@name="personalDetails.secondaryPhone"]');
        this.address = page.locator('//input[@name="personalDetails.address"]');
        this.listboxHasPopup = page.locator('//div[@role="combobox"]');//nth() => 0.id --- 1.Marital Status --- 2.gender
        this.contactsFirstName = page.locator('//input[@name="primaryContact.firstName"]');
        this.contactsLastName = page.locator('//input[@name="primaryContact.lastName"]');
        this.contactsPhoneNumber = page.locator('//input[@name="primaryContact.primaryPhone"]');
        this.submit = page.locator('//button[@type="submit"]');
        this.return = page.locator('//button[@type="button"]').nth(5);
        this.initPage();
    }


    fillFirstName = async (fName: string) => {
        await this.firstName.fill(fName)
    }

    fillLastName = async (laName: string) => {
        await this.lastName.fill(laName)
    }


    fillId = async (idNum: string) => {
        await this.id.fill(idNum)
    }

    selectId = async (idAndPassToSelect: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {
            const list = await element.$$('li');

            let targetElement = null;
            for (const select of list) {
                const text = await select.textContent();
                if (text === idAndPassToSelect) {
                    targetElement = select;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`The chosen "${idAndPassToSelect}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    selectHealthFund = async (healthFund: string) => {
        const element = await this.page.$('//ul[@class="MuiAutocomplete-listbox rtl-1ll4iij"]');

        if (!element) {
            throw new Error('UL element not found.');
        }
        const list = await element.$$('li');
        for (const select of list) {
            const text = (await select.textContent())?.trim(); // Use optional chaining here
            if (text === healthFund) {
                await select.click();
                return; // Exit the loop if the health fund is found and selected
            }
        }
        throw new Error(`The chosen "${healthFund}" is not found in the list.`);
    }

    fillBday = async (bDay: string) => {
        await this.birthday.fill(bDay);
    }

    fillPhoneNumber = async (phoneNum: string) => {
        await this.phoneNumber.fill(phoneNum)
    }

    fillAnotherPhone = async (anotherNum: string) => {
        await this.anotherPhone.fill(anotherNum)
    }

    selectMaritalStatus = async (maritalStatus: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {
            const list = await element.$$('li');

            let targetElement = null;
            for (const select of list) {
                const text = await select.textContent();
                if (text === maritalStatus) {
                    targetElement = select;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`The chosen "${maritalStatus}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    selectGender = async (gender: string) => {
        const element = await this.page.$('//ul[@class="MuiList-root MuiList-padding MuiMenu-list rtl-r8u8y9"]');

        if (element) {
            const list = await element.$$('li');

            let targetElement = null;
            for (const select of list) {
                const text = await select.textContent();
                if (text === gender) {
                    targetElement = select;
                    break;
                }
            }
            if (targetElement) {
                await targetElement.click();
            } else {
                throw new Error(`The chosen "${gender}" is not found in the list.`);
            }
        } else {
            throw new Error('UL element not found.');
        }
    }

    fillAddress = async (address: string) => {
        await this.address.fill(address)
    }

    fillContactsFirstName = async (firstName: string) => {
        await this.contactsFirstName.fill(firstName)
    }

    fillContactslastName = async (lastName: string) => {
        await this.contactsLastName.fill(lastName)
    }

    fillContactsPhoneNumber = async (phoneNumb: string) => {
        await this.contactsPhoneNumber.fill(phoneNumb)
    }

    clickOnSubmit = async () => {
        await this.submit.click();
    }

    performAddingPatient = async (fName: string, lName: string, selectIdType: string, idNumber: string, healthFund: string, birthDay: string,
        phoNum: string, anotherPhoNum: string, mariStatus: string, addres: string, gend: string, conFirstName: string, conLastName: string, conPhoneNum: string) => {
        await this.fillFirstName(fName);
        await this.fillLastName(lName);
        await this.listboxHasPopup.nth(0).click()
        await this.selectId(selectIdType);
        await this.fillId(idNumber);
        await this.helthFundsField.click();
        await this.page.waitForTimeout(1000);
        await this.selectHealthFund(healthFund);
        await this.fillBday(birthDay);
        await this.fillPhoneNumber(phoNum);
        await this.fillAnotherPhone(anotherPhoNum);
        await this.listboxHasPopup.nth(1).click();
        await this.selectMaritalStatus(mariStatus)
        await this.fillAddress(addres);
        await this.listboxHasPopup.nth(2).click();
        await this.selectGender(gend);
        await this.fillContactsFirstName(conFirstName);
        await this.fillContactslastName(conLastName);
        await this.fillContactsPhoneNumber(conPhoneNum);
        await this.clickOnSubmit();
    }
    //כל הפונקציות לאחד אותם***************
}