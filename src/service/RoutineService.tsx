//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class RoutineService {
  public static async routinePreferenceList() {
    const url = `${API.ROUTINE_PREFERENCE_LIST}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postRoutineDetails(routineId: number) {
    const url = `${API.POST_ROUTINE_DETAILS}`;
    const response = await Http.post(url, routineId);
    return response;
  }

  public static async postShareRoutine(shareData: any) {
    const url = `${API.POST_SHARE_ROUTINE}`;
    const response = await Http.post(url, shareData);
    return response;
  }

  public static async postAllCommentOnRoutine(routineId: number) {
    const url = `${API.POST_ALL_COMMENTS_ON_ROUTINE}`;
    const response = await Http.post(url, routineId);
    return response;
  }

  public static async getAllCommunityRoutines() {
    const url = `${API.GET_COMMUNITY_ROUTINES}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getAllSearchCommunityRoutines(searchData: any) {
    const url = `${API.GET_COMMUNITY_ROUTINES}?search=${searchData}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postFilterCommunityRoutines(searchData: any) {
    const url = `${API.POST_FILTER_COMMUNITY_ROUTINES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postAllMyRoutines(searchData?: any) {
    const url = `${API.POST_MY_ROUTINES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async getAllSharedRoutines() {
    const url = `${API.GET_SHARED_ROUTINES}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSearchSharedRoutines(searchData: any) {
    const url = `${API.GET_SHARED_ROUTINES}?search=${searchData}`;
    const response = await Http.get(url);
    return response;
  }
}

export default RoutineService;
