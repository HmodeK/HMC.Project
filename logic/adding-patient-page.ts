import { BasePage } from "../infra/browser/base-page";
import { Locator, Page } from "playwright";

export class AddingPatientPage extends BasePage {

    private firstName: Locator
    private lastName: Locator
    private id!: Locator;



    constructor(page: Page) {
        super(page);
        this.firstName = page.locator('//input[@name="personalDetails.firstName"]');
        this.lastName = page.locator('');
        this.initPage();
    }

    //ul[@class="MuiAutocomplete-listbox rtl-1ll4iij"]
}