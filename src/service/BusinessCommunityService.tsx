//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class BusinessCommunityService {
  public static async postCreateBusiness(businessData: any) {
    const url = `${API.POST_CREATE_BUSINESS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postHomeBusiness() {
    const url = `${API.POST_HOME_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postMyAllFollowedBusiness() {
    const url = `${API.POST_MY_ALL_FOLLOWED_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchMyAllFollowedBusiness(searchData: any) {
    const url = `${API.POST_MY_ALL_FOLLOWED_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postMyAllSubscribedBusiness() {
    const url = `${API.POST_MY_ALL_SUBSCRIBED_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchMyAllSubscribedBusiness(searchData: any) {
    const url = `${API.POST_MY_ALL_SUBSCRIBED_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postMyAllBusiness() {
    const url = `${API.POST_MY_ALL_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchMyAllBusiness(searchData: any) {
    const url = `${API.POST_MY_ALL_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postAllRecentlyBusiness() {
    const url = `${API.POST_ALL_RECENTLY_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchAllRecentlyBusiness(searchData: any) {
    const url = `${API.POST_ALL_RECENTLY_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postAllSuggestedBusiness() {
    const url = `${API.POST_ALL_SUGGESTED_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchAllSuggestedBusiness(searchData: any) {
    const url = `${API.POST_ALL_SUGGESTED_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postFollowUnFollowBusiness(followData: any) {
    const url = `${API.POST_FOLLOW_UN_FOLLOW_BUSINESS}`;
    const response = await Http.post(url, followData);
    return response;
  }

  public static async getBusinessDetails(businessId: any) {
    const url = `${API.GET_BUSINESS_DETAILS}/${businessId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAllBusinessFollowers(businessId: any) {
    const url = `${API.POST_ALL_BUSINESS_FOLLOWERS}`;
    const response = await Http.post(url, businessId);
    return response;
  }

  public static async postAllBusinessSubscribers(businessData: any) {
    const url = `${API.POST_ALL_BUSINESS_SUBSCRIBERS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async getDeleteBusiness(businessId: any) {
    const url = `${API.GET_DELETE_BUSINESS}/${businessId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditBusiness(businessData: any) {
    const url = `${API.POST_EDIT_BUSINESS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postSubscribeBusiness(businessData: any) {
    const url = `${API.POST_SUBSCRIBE_BUSINESS}`;
    const response = await Http.post(url, businessData);
    return response;
  }

  public static async postBusinessAddPost(postData: any) {
    const url = `${API.POST_ADD_POST}`;
    const response = await Http.post(url, postData);
    return response;
  }

  public static async postBusinessEditPost(postData: any) {
    const url = `${API.POST_EDIT_POST}`;
    const response = await Http.post(url, postData);
    return response;
  }

  public static async getDeleteBusinessPost(postId: any) {
    const url = `${API.GET_DELETE_POST}/${postId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postBusinessSubscriptionPayment(postData: any) {
    const url = `${API.POST_BUSINESS_SUBSCRIPTION_PAYMENT}`;
    const response = await Http.post(url, postData);
    return response;
  }

  // community section
  public static async postCreateCommunity(communityData: any) {
    const url = `${API.POST_CREATE_COMMUNITY}`;
    const response = await Http.post(url, communityData);
    return response;
  }

  public static async postHomeCommunity() {
    const url = `${API.POST_HOME_COMMUNITY}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchHomeCommunity(searchData: any) {
    const url = `${API.POST_HOME_COMMUNITY}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postFollowUnFollowCommunity(followData: any) {
    const url = `${API.POST_FOLLOW_UN_FOLLOW_COMMUNITY}`;
    const response = await Http.post(url, followData);
    return response;
  }

  public static async getCommunityDetails(communityId: any) {
    const url = `${API.GET_COMMUNITY_DETAILS}/${communityId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAllCommunityFollowers(communityId: any) {
    const url = `${API.POST_ALL_COMMUNITY_FOLLOWERS}`;
    const response = await Http.post(url, communityId);
    return response;
  }

  public static async getDeleteCommunity(communityId: any) {
    const url = `${API.GET_DELETE_COMMUNITY}/${communityId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditCommunity(communityData: any) {
    const url = `${API.POST_EDIT_COMMUNITY}`;
    const response = await Http.post(url, communityData);
    return response;
  }

  public static async postRecentActivityBusiness() {
    const url = `${API.POST_RECENT_ACTIVITY_BUSINESS}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchRecentActivityBusiness(searchData: any) {
    const url = `${API.POST_RECENT_ACTIVITY_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postAllAppointmentOnBusiness(searchData: any) {
    const url = `${API.POST_ALL_APPOINTMENT_ON_BUSINESS}`;
    const response = await Http.post(url, searchData);
    return response;
  }
}

export default BusinessCommunityService;
