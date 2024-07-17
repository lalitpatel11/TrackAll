//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class GoalTrackerService {
  public static async getAllGoal(data?: any) {
    const url = `${API.POST_ALL_GOAL}`;
    const response = await Http.post(url, data);
    return response;
  }

  public static async getSearchAllGoal(getSearchGoalData: any) {
    const url = `${API.POST_ALL_GOAL}`;
    const response = await Http.post(url, getSearchGoalData);
    return response;
  }

  public static async postGoalOnHome(goalDate: any) {
    const url = `${API.POST_GOAL_ON_HOME}`;
    const response = await Http.post(url, goalDate);
    return response;
  }

  public static async postCreateGoal(goalData: any) {
    const url = `${API.POST_CREATE_GOAL}`;
    const response = await Http.post(url, goalData);
    return response;
  }

  public static async postMarkCompleteGoal(goalData: any) {
    const url = `${API.POST_MARK_COMPLETE_GOAL}`;
    const response = await Http.post(url, goalData);
    return response;
  }

  public static async postMarkInCompleteGoal(goalData: any) {
    const url = `${API.POST_MARK_INCOMPLETE_GOAL}`;
    const response = await Http.post(url, goalData);
    return response;
  }

  public static async postGoalDetails(goalId: any) {
    const url = `${API.POST_GOAL_DETAILS}`;
    const response = await Http.post(url, goalId);
    return response;
  }

  public static async postTimeWithDate(goalData: any) {
    const url = `${API.GET_TIME_WITH_DATE}`;
    const response = await Http.post(url, goalData);
    return response;
  }

  public static async getDeleteGoal(deleteGoalId: any) {
    const url = `${API.GET_DELETE_GOAL}/${deleteGoalId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditGoal(editGoalData: any) {
    const url = `${API.POST_EDIT_GOAL}`;
    const response = await Http.post(url, editGoalData);
    return response;
  }
}

export default GoalTrackerService;
