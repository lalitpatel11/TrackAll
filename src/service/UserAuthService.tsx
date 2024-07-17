//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class UserAuthService {
  public static async signUpOtp(signUpDetails: any) {
    const url = `${API.SIGN_UP}`;
    const response = await Http.post(url, signUpDetails);
    return response;
  }

  public static async signUpVerifyOtp(otpDetails: any) {
    const url = `${API.SIGN_UP_OTP}`;
    const response = await Http.post(url, otpDetails);
    return response;
  }

  public static async preferenceList() {
    const url = `${API.PREFERENCE_LIST}`;
    const response = await Http.get(url);
    return response;
  }

  public static async signUpDetails(signUpDetails: any) {
    const url = `${API.SIGN_UP_DETAILS}`;
    const response = await Http.post(url, signUpDetails);
    return response;
  }

  public static async signInOtp(signInDetails: any) {
    const url = `${API.SIGN_IN}`;
    const response = await Http.post(url, signInDetails);
    return response;
  }

  public static async signInVerifyOtp(otpDetails: any) {
    const url = `${API.SIGN_IN_OTP}`;
    const response = await Http.post(url, otpDetails);
    return response;
  }

  public static async getMyProfile() {
    const url = `${API.GET_MY_PROFILE}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getMyBusinessProfile(accountId: any) {
    const url = `${API.GET_MY_PROFILE}?accountId=${accountId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditProfile(profileDetails: any) {
    const url = `${API.POST_EDIT_PROFILE}`;
    const response = await Http.post(url, profileDetails);
    return response;
  }

  public static async postEditPreferences(preferencesDetails: any) {
    const url = `${API.POST_ADD_PREFERENCES}`;
    const response = await Http.post(url, preferencesDetails);
    return response;
  }

  public static async getDeleteProfile() {
    const url = `${API.GET_DELETE_PROFILE}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postGmailSocialLogin(loginData: any) {
    const url = `${API.POST_GMAIL_SOCIAL_LOGIN}`;
    const response = await Http.post(url, loginData);
    return response;
  }

  public static async postFbSocialLogin(loginData: any) {
    const url = `${API.POST_FB_SOCIAL_LOGIN}`;
    const response = await Http.post(url, loginData);
    return response;
  }

  public static async postUserEmailAvailable(email: any) {
    const url = `${API.POST_USER_EMAIL_AVAILABLE}`;
    const response = await Http.post(url, email);
    return response;
  }

  public static async postCheckEmailStatus(email: any) {
    const url = `${API.POST_SIGN_UP_EMAIL_AVAILABLE}`;
    const response = await Http.post(url, email);
    return response;
  }

  public static async postBusinessOrganizationSignUp(signUpData: any) {
    const url = `${API.POST_BUSINESS_ORGANIZATION_SIGN_UP}`;
    const response = await Http.post(url, signUpData);
    return response;
  }
}

export default UserAuthService;
