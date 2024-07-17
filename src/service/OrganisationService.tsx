//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class OrganizationService {
  public static async postOrganizationHome(monthDetails: any) {
    const url = `${API.POST_ORGANIZATION_HOME_DETAILS}`;
    const response = await Http.post(url, monthDetails);
    return response;
  }

  public static async getMyOrganizationGroups() {
    const url = `${API.GET_MY_GROUPS}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSearchMyOrganizationGroups(
    getSearchMyGroupsData: any,
  ) {
    const url = `${API.GET_MY_GROUPS}?search=${getSearchMyGroupsData}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postOrganizationExpanseManagementHome() {
    const url = `${API.POST_EXPANSE_HOME_SCREEN}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postListOrganizationBudgetaryRestriction() {
    const url = `${API.POST_LIST_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postMyOrganizationEvents(locationData: any) {
    const url = `${API.POST_MY_EVENTS}`;
    const response = await Http.post(url, locationData);
    return response;
  }

  public static async postAppointmentOnCalendar(businessData: any) {
    const url = `${API.POST_APPOINTMENT_ON_CALENDAR}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postAddOrganizationAppointment(
    businessAppointmentData: any,
  ) {
    const url = `${API.POST_ADD_BUSINESS_APPOINTMENT}`;
    const response = await Http.post(url, businessAppointmentData);
    return response;
  }

  public static async postAllAppointmentOnDate(appointmentData: any) {
    const url = `${API.POST_ALL_APPOINTMENT_ON_DATE}`;
    const response = await Http.post(url, appointmentData);
    return response;
  }

  public static async getAppointmentData(appointmentId: any) {
    const url = `${API.GET_APPOINTMENT_DETAILS}/${appointmentId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getDeleteAppointment(appointmentId: any) {
    const url = `${API.GET_DELETE_APPOINTMENT}/${appointmentId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditBusinessAppointment(appointmentData: any) {
    const url = `${API.POST_EDIT_APPOINTMENT}`;
    const response = await Http.post(url, appointmentData);
    return response;
  }

  public static async postAddNewEmployee(employeeData: any) {
    const url = `${API.POST_ADD_EMPLOYEE}`;
    const response = await Http.post(url, employeeData);
    return response;
  }

  public static async postAllEmployeeList() {
    const url = `${API.POST_ALL_EMPLOYEE}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchAllEmployeeList(searchData: any) {
    const url = `${API.POST_ALL_EMPLOYEE}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async getDeleteOrganizationEmployee(employeeId: any) {
    const url = `${API.GET_DELETE_ORGANIZATION_EMPLOYEE}/${employeeId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditOrganizationEmployee(employeeData: any) {
    const url = `${API.POST_EDIT_ORGANIZATION_EMPLOYEE}`;
    const response = await Http.post(url, employeeData);
    return response;
  }
}

export default OrganizationService;
