//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class SplitService {
  public static async postAddSplitGroup(splitData: any) {
    const url = `${API.POST_ADD_SPLIT_GROUP}`;
    const response = await Http.post(url, splitData);
    return response;
  }

  public static async postAddSplitBill(splitData: any) {
    const url = `${API.POST_ADD_SPLIT_BILL}`;
    const response = await Http.post(url, splitData);
    return response;
  }

  public static async postSplitGroupList() {
    const url = `${API.POST_SPLIT_GROUP_LIST}`;
    const response = await Http.post(url);
    return response;
  }

  public static async postSearchSplitGroupList(searchData: any) {
    const url = `${API.POST_SPLIT_GROUP_LIST}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postSplitBillList(splitData: any) {
    const url = `${API.POST_SPLIT_BILL_LIST}`;
    const response = await Http.post(url, splitData);
    return response;
  }

  public static async postSearchSplitBillList(searchData: any) {
    const url = `${API.POST_SPLIT_BILL_LIST}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postSettleSplitBillList(splitData: any) {
    const url = `${API.POST_SETTLE_SPLIT_BILL_LIST}`;
    const response = await Http.post(url, splitData);
    return response;
  }

  public static async postSearchSettleSplitBillList(searchData: any) {
    const url = `${API.POST_SETTLE_SPLIT_BILL_LIST}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postMarkSettleSplitBill(settleId: any) {
    const url = `${API.POST_MARK_SETTLE_SPLIT_BILL}`;
    const response = await Http.post(url, settleId);
    return response;
  }

  public static async getSplitDetails(splitId: any) {
    const url = `${API.GET_SPLIT_DETAILS}/${splitId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postSplitGroupComment(commentData: any) {
    const url = `${API.POST_ADD_SPLIT_COMMENT}`;
    const response = await Http.post(url, commentData);
    return response;
  }
}
export default SplitService;
