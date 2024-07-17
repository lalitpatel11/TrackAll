//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';
class HomeScreenService {
  public static async postHomeDetails(locationData: any) {
    const url = `${API.POST_HOME_DETAILS}`;
    const response = await Http.post(url, locationData);
    return response;
  }

  public static async postTaskOnHome(filerData: any) {
    const url = `${API.POST_TASK_ON_HOME}`;
    const response = await Http.post(url, filerData);
    return response;
  }

  public static async postHideTask(hideTaskData: any) {
    const url = `${API.POST_HIDE_TASK}`;
    const response = await Http.post(url, hideTaskData);
    return response;
  }
}

export default HomeScreenService;
