//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class ExpensesManagementService {
  public static async postListExpensesCategory() {
    const url = `${API.POST_LIST_EXPENSES_CATEGORY}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postListExpensesSubCategory(subExpensesId: any) {
    const url = `${API.POST_LIST_EXPENSES_SUB_CATEGORY}`;
    const response = await Http.post(url, subExpensesId);
    return response;
  }

  public static async postListBudgetaryRestriction(budgetaryData?: any) {
    const url = `${API.POST_LIST_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url, budgetaryData);
    return response;
  }

  public static async postSearchBudgetaryRestriction(searchData: any) {
    const url = `${API.POST_LIST_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postAddUserExpanse(expansesData: any) {
    const url = `${API.POST_ADD_USER_EXPANSE}`;
    const response = await Http.post(url, expansesData);
    return response;
  }

  public static async postAllUserExpenses(accountId?: any) {
    const url = `${API.POST_ALL_USER_EXPANSE}`;
    const response = await Http.post(url, accountId);
    return response;
  }

  public static async postSearchAllUserExpenses(searchData: any) {
    const url = `${API.POST_ALL_USER_EXPANSE}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postEditExpanse(expanseData: any) {
    const url = `${API.POST_EDIT_EXPANSE}`;
    const response = await Http.post(url, expanseData);
    return response;
  }

  public static async getDeleteExpanse(expanseId: any) {
    const url = `${API.GET_DELETE_EXPANSE}/${expanseId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAddBudgetaryRestriction(budgetaryData: any) {
    const url = `${API.POST_ADD_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url, budgetaryData);
    return response;
  }

  public static async postEditBudgetaryRestriction(budgetaryData: any) {
    const url = `${API.POST_EDIT_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url, budgetaryData);
    return response;
  }

  public static async getDeleteBudgetaryRestriction(budgetaryId: any) {
    const url = `${API.GET_DELETE_BUDGETARY_RESTRICTION}/${budgetaryId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSavedCards() {
    const url = `${API.GET_SAVED_CARDS}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postExpanseManagementHome() {
    const url = `${API.POST_EXPANSE_HOME_SCREEN}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postAddCategory(categoryData: any) {
    const url = `${API.POST_ADD_CATEGORY}`;
    const response = await Http.post(url, categoryData);
    return response;
  }

  public static async postAddSubCategory(categoryData: any) {
    const url = `${API.POST_ADD_SUB_CATEGORY}`;
    const response = await Http.post(url, categoryData);
    return response;
  }

  public static async getDeleteCategory(categoryId: any) {
    const url = `${API.GET_DELETE_CATEGORY}/${categoryId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAllUpComingExpenses() {
    const url = `${API.POST_ALL_UPCOMING_EXPENSES}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchAllUpComingExpenses(searchData: any) {
    const url = `${API.POST_ALL_UPCOMING_EXPENSES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postListAllBudget(expensId: any) {
    const url = `${API.POST_LIST_ALL_BUDGETARY}`;
    const response = await Http.post(url, expensId);
    return response;
  }

  public static async postAddExpenseToBudgetary(budgetaryData: any) {
    const url = `${API.POST_ADD_EXPENSE_TO_BUDGET}`;
    const response = await Http.post(url, budgetaryData);
    return response;
  }

  public static async postCheckMonthData(monthData: any) {
    const url = `${API.POST_CHECK_MONTH_BUDGET}`;
    const response = await Http.post(url, monthData);
    return response;
  }
}
export default ExpensesManagementService;
