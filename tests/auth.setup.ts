import { test as setup, expect } from '@playwright/test';
import urls from "../configFiles/urls.json"
import user from "../configFiles/user.json"
import auth from "../configFiles/config.json"
import { LoginPage } from '../logic/login-page';

setup('authenticate', async ({ page }) => {
    await page.goto(urls.uiUrl.websiteUrl)
    const mainPage = new LoginPage(page)
    await mainPage.makeLogin(user.loginPage.userName, user.loginPage.password)
    await page.waitForURL(urls.uiUrl.websiteUrlAfterLogin)
    await page.context().storageState({ path: auth.authFile })
});