//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class BusinessService {
  public static async postBusinessHome(accountId: any) {
    const url = `${API.POST_BUSINESS_HOME_DETAILS}`;
    const response = await Http.post(url, accountId);
    return response;
  }

  public static async postMyAllBusinessList() {
    const url = `${API.POST_MY_ALL_BUSINESS_LIST}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postEditMyBusiness(businessData: any) {
    const url = `${API.POST_EDIT_MY_BUSINESS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postAddNewBusiness(businessData: any) {
    const url = `${API.POST_ADD_NEW_BUSINESS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async getDeleteMyBusiness(businessId: any) {
    const url = `${API.GET_DELETE_MY_BUSINESS}/${businessId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAppointmentOnCalendar(businessData: any) {
    const url = `${API.POST_APPOINTMENT_ON_CALENDAR}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postAddBusinessAppointment(businessAppointmentData: any) {
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

  public static async getMyBusinessGroups(accountId: any) {
    const url = `${API.GET_MY_GROUPS}?accountId=${accountId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSearchMyBusinessGroups(
    getSearchMyGroupsData: any,
    accountId: any,
  ) {
    const url = `${API.GET_MY_GROUPS}?search=${getSearchMyGroupsData}&accountId=${accountId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postBusinessExpanseManagementHome(accountId: any) {
    const url = `${API.POST_EXPANSE_HOME_SCREEN}`;
    const response = await Http.post(url, accountId);
    return response;
  }

  public static async postListBusinessBudgetaryRestriction(accountId: any) {
    const url = `${API.POST_LIST_BUDGETARY_RESTRICTION}`;
    const response = await Http.post(url, accountId);
    return response;
  }

  public static async postMyBusinessEvents(locationData: any) {
    const url = `${API.POST_MY_EVENTS}`;
    const response = await Http.post(url, locationData);
    return response;
  }

  public static async postAcceptAppointment(appointmentId: any) {
    const url = `${API.POST_ACCEPT_APPOINTMENT}`;
    const response = await Http.post(url, appointmentId);
    return response;
  }

  public static async postRejectAppointment(appointmentId: any) {
    const url = `${API.POST_REJECT_APPOINTMENT}`;
    const response = await Http.post(url, appointmentId);
    return response;
  }

  public static async postAddBusinessService(serviceData: any) {
    const url = `${API.POST_ADD_BUSINESS_SERVICE}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postAllBusinessOnService(serviceData: any) {
    const url = `${API.POST_ALL_BUSINESS_ON_SERVICE}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postUnAvailabilityService(serviceData: any) {
    const url = `${API.POST_BUSINESS_UNAVAILABILITY_SERVICE}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postUManageUnAvailabilityService(serviceData: any) {
    const url = `${API.POST_BUSINESS_MANAGE_UNAVAILABILITY_SERVICE}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postDeleteService(serviceId: any) {
    const url = `${API.POST_DELETE_SERVICE}`;
    const response = await Http.post(url, serviceId);
    return response;
  }

  public static async postBusinessHours(serviceData: any) {
    const url = `${API.POST_BUSINESS_HOURS}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postUpdateBusinessHours(serviceData: any) {
    const url = `${API.POST_UPDATE_BUSINESS_HOURS}`;
    const response = await Http.post(url, serviceData);
    return response;
  }

  public static async postRequestForAppointments(appointmentData: any) {
    const url = `${API.POST_REQUEST_FOR_APPOINTMENT}`;
    const response = await Http.post(url, appointmentData);
    return response;
  }

  public static async postAllTimeSLot(timeSlotData: any) {
    const url = `${API.POST_ALL_TIME_SLOT}`;
    const response = await Http.post(url, timeSlotData);
    return response;
  }
}

export default BusinessService;
