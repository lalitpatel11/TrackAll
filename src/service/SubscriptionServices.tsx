//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class SubscriptionServices {
  public static async getAllSubscription() {
    const url = `${API.GET_ALL_SUBSCRIPTION}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getMySubscription() {
    const url = `${API.GET_MY_SUBSCRIPTION}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postNewSubscription(subscriptionData: any) {
    const url = `${API.POST_NEW_SUBSCRIPTION}`;
    const response = await Http.post(url, subscriptionData);
    return response;
  }

  public static async getCancelSubscription() {
    const url = `${API.GET_CANCEL_SUBSCRIPTION}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postPaymentIntent(paymentData: any) {
    const url = `${API.POST_PAYMENT_INTENT}`;
    const response = await Http.post(url, paymentData);
    return response;
  }
  public static async purchaseAppleSubscription(postData: any) {
    const url = `${API.BUY_APPLE_SUBSCRIPTION}`;
    const response = await Http.post(url, postData);
    return response;
  }
}

export default SubscriptionServices;
