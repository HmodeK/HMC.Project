import { test as setup } from '@playwright/test';
import urls from "../configFiles/urls.json"
import user from "../configFiles/user.json"
import auth from "../configFiles/config.json"
import { LoginPage } from '../logic/login-page';

setup('authenticate', async ({ page }) => {
    await page.goto(urls.login)
    const mainPage = new LoginPage(page)
    await mainPage.makeLogin(user.loginPage.userName, user.loginPage.password)
    await page.waitForURL(urls.dashboard)
    await page.context().storageState({ path: auth.authFile })
});