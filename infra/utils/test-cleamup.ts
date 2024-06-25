import { AddingEmployeePage } from "../../logic/adding-employee-page"
import { EmployeeList } from "../../logic/employee-list-page";
import { EmployeeProfilePage } from "../../logic/employee-profile-page";
import config from "../../configFiles/config.json";

export class TestCleanup {
    private addingEmployeePage: AddingEmployeePage;
    private employeeList: EmployeeList;
    private employeeProfilePage: EmployeeProfilePage;

    constructor(addingEmployeePage: AddingEmployeePage, employeeList: EmployeeList, employeeProfilePage: EmployeeProfilePage) {
        this.addingEmployeePage = addingEmployeePage;
        this.employeeList = employeeList;
        this.employeeProfilePage = employeeProfilePage;
    }

     performCleanup = async(
        areTheDetailsUpdated: boolean,
        isTheEmployeeAdded: boolean,
        areTheMaritalIsUpdated: boolean
    )=> {
        try {
            if (areTheDetailsUpdated || isTheEmployeeAdded) {
                await this.addingEmployeePage.performActionAfterTest(
                    areTheDetailsUpdated,
                    isTheEmployeeAdded,
                    config.employees.employee36,
                    config.employees.employee36,
                    config.OperationsInEmployeesPage.update,
                    config.gender.male,
                    config.employeeWeAreLookingFor.fullName,
                    config.OperationsInEmployeesPage.employeeBlocking,
                    this.employeeList,
                    this.addingEmployeePage
                );

                areTheDetailsUpdated = false;
                isTheEmployeeAdded = false;
            }

            if (areTheMaritalIsUpdated) {
                await this.employeeProfilePage.selectEditingDetails();
                await this.addingEmployeePage.performUpdatingAboutMaritalStatus(config.maritalStatus.Married);
                areTheMaritalIsUpdated = false;
            }
        } catch (error) {
            console.error(`Error during cleanup: ${error}`);
        }
    }
}
