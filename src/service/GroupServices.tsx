//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class GroupServices {
  public static async postCreateGroup(groupName: any) {
    const url = `${API.POST_CREATE_GROUP}`;
    const response = await Http.post(url, groupName);
    return response;
  }

  public static async postAllMembers(postAllMembers: any) {
    const url = `${API.POST_ALL_MEMBERS}`;
    const response = await Http.post(url, postAllMembers);
    return response;
  }

  public static async postAddMembers(postAddMembers: any) {
    const url = `${API.POST_ADD_MEMBERS}`;
    const response = await Http.post(url, postAddMembers);
    return response;
  }

  public static async postRecentlyAddMembers(postRecentlyAddMembers: any) {
    const url = `${API.POST_RECENTLY_ADDED_MEMBERS}`;
    const response = await Http.post(url, postRecentlyAddMembers);
    return response;
  }

  public static async postEditGroupName(postEditGroupName: any) {
    const url = `${API.POST_EDIT_GROUP_NAME}`;
    const response = await Http.post(url, postEditGroupName);
    return response;
  }

  public static async postCreateTask(postCreateTaskData: any) {
    const url = `${API.POST_CREATE_TASK}`;
    const response = await Http.post(url, postCreateTaskData);
    return response;
  }

  public static async postTasksInGroup(postTasksInGroupId: any) {
    const url = `${API.POST_ADDED_TASK_IN_GROUP}`;
    const response = await Http.post(url, postTasksInGroupId);
    return response;
  }

  public static async postManageGroup(postManageGroup: any) {
    const url = `${API.POST_MANAGE_GROUP}`;
    const response = await Http.post(url, postManageGroup);
    return response;
  }

  public static async getDeleteGroup(getDeleteGroupId: any) {
    const url = `${API.GET_DELETE_GROUP}/${getDeleteGroupId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getDeleteMyTask(getDeleteMyTaskId: any) {
    const url = `${API.GET_DELETE_MY_TASK}/${getDeleteMyTaskId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getMyGroups() {
    const url = `${API.GET_MY_GROUPS}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSearchMyGroups(getSearchMyGroupsData: any) {
    const url = `${API.GET_MY_GROUPS}?search=${getSearchMyGroupsData}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSharedGroups() {
    const url = `${API.GET_SHARED_GROUPS}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getSearchSharedGroups(getSearchSharedGroupsData: any) {
    const url = `${API.GET_SHARED_GROUPS}?search=${getSearchSharedGroupsData}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getGroupDetails(getGroupDetailsId: any) {
    const url = `${API.GET_GROUP_DETAILS}/${getGroupDetailsId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAddComment(postAddComment: any) {
    const url = `${API.POST_ADD_COMMENT}`;
    const response = await Http.post(url, postAddComment);
    return response;
  }

  public static async postAllCommentsOnTask(postAllCommentsOnTaskId: any) {
    const url = `${API.POST_ALL_COMMENTS_ON_TASK}`;
    const response = await Http.post(url, postAllCommentsOnTaskId);
    return response;
  }

  public static async postAddSubComment(postAddSubComment: any) {
    const url = `${API.POST_ADD_SUB_COMMENT}`;
    const response = await Http.post(url, postAddSubComment);
    return response;
  }

  public static async postAllSubCommentsOnComment(
    postAllSubCommentsOnCommentId: any,
  ) {
    const url = `${API.POST_ALL_SUB_COMMENTS_ON_TASK}`;
    const response = await Http.post(url, postAllSubCommentsOnCommentId);
    return response;
  }

  public static async postInviteUser(postInviteUserData: any) {
    const url = `${API.POST_INVITE_USER}`;
    const response = await Http.post(url, postInviteUserData);
    return response;
  }

  public static async postDeleteComment(postDeleteCommentId: any) {
    const url = `${API.POST_DELETE_COMMENT}`;
    const response = await Http.post(url, postDeleteCommentId);
    return response;
  }

  public static async postEditComment(postEditCommentData: any) {
    const url = `${API.POST_EDIT_COMMENT}`;
    const response = await Http.post(url, postEditCommentData);
    return response;
  }

  public static async postRequestToGroupAdd(postRequestToGroupAddData: any) {
    const url = `${API.POST_REQUEST_TO_GROUP_ADD}`;
    const response = await Http.post(url, postRequestToGroupAddData);
    return response;
  }

  public static async getTasksDetails(taskId: number) {
    const url = `${API.GET_TASK_DETAILS}/${taskId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getDeleteTask(deleteId: any) {
    const url = `${API.GET_DELETE_TASK}/${deleteId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postEditTask(taskData: any) {
    const url = `${API.POST_EDIT_TASK}`;
    const response = await Http.post(url, taskData);
    return response;
  }

  public static async postGroupMembersDelete(deleteId: any) {
    const url = `${API.POST_GROUP_MEMBERS_DELETE}`;
    const response = await Http.post(url, deleteId);
    return response;
  }

  public static async postCompleteTask(taskId: any) {
    const url = `${API.POST_COMPLETE_TASK}`;
    const response = await Http.post(url, taskId);
    return response;
  }

  public static async postInCompleteTask(data: any) {
    const url = `${API.POST_IN_COMPLETE_TASK}`;
    const response = await Http.post(url, data);
    return response;
  }

  public static async postSearchMembers(searchText: any) {
    const url = `${API.POST_SEARCH_GROUP_MEMBER}`;
    const response = await Http.post(url, searchText);
    return response;
  }
}

export default GroupServices;
