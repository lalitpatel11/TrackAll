//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class NotificationService {
  public static async getNotification() {
    const url = `${API.GET_ALL_NOTIFICATION}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getReadNotification(notificationId: any) {
    const url = `${API.GET_READ_NOTIFICATION}/${notificationId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getClearAllNotification() {
    const url = `${API.GET_CLEAR_ALL_NOTIFICATION}`;
    const response = await Http.get(url);
    return response;
  }
}

export default NotificationService;
