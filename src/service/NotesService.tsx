//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class NotesService {
  public static async getMyNotes() {
    const url = `${API.POST_MY_NOTES}`;
    const response = await Http.post(url);
    return response;
  }

  public static async getSearchMyNotes(searchData: any) {
    const url = `${API.POST_MY_NOTES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async getSharedNotes() {
    const url = `${API.POST_SHARED_NOTES}`;
    const response = await Http.post(url);
    return response;
  }

  public static async getSearchSharedNotes(searchData: any) {
    const url = `${API.POST_SHARED_NOTES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async getPublicNotes() {
    const url = `${API.POST_PUBLIC_NOTES}`;
    const response = await Http.post(url);
    return response;
  }

  public static async getSearchPublicNotes(searchData: any) {
    const url = `${API.POST_PUBLIC_NOTES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async getPinnedNotes() {
    const url = `${API.POST_PINNED_NOTES}`;
    const response = await Http.post(url);
    return response;
  }

  public static async getSearchPinnedNotes(searchData: any) {
    const url = `${API.POST_PINNED_NOTES}`;
    const response = await Http.post(url, searchData);
    return response;
  }

  public static async postCreateNotes(notesData: any) {
    const url = `${API.POST_CREATE_NOTES}`;
    const response = await Http.post(url, notesData);
    return response;
  }

  public static async postEditNotes(editNotesData: any) {
    const url = `${API.POST_EDIT_NOTES}`;
    const response = await Http.post(url, editNotesData);
    return response;
  }

  public static async getDeleteNotes(deleteNotesId: any) {
    const url = `${API.GET_DELETE_NOTES}/${deleteNotesId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getPinUnPinNotes(pinNotesId: object) {
    const url = `${API.GET_PIN_UNPIN_NOTES}`;
    const response = await Http.post(url, pinNotesId);
    return response;
  }

  public static async getNotesDetails(notesId: number) {
    const url = `${API.GET_NOTES_DETAILS}/${notesId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postShareNotes(shareNotesData: any) {
    const url = `${API.POST_SHARE_NOTES}`;
    const response = await Http.post(url, shareNotesData);
    return response;
  }

  public static async postRemoveShareNotes(removeShareNotesData: any) {
    const url = `${API.POST_REMOVE_SHARE_NOTES}`;
    const response = await Http.post(url, removeShareNotesData);
    return response;
  }

  public static async postManageNotes(postManageNotesData: any) {
    const url = `${API.POST_MANAGE_NOTES}`;
    const response = await Http.post(url, postManageNotesData);
    return response;
  }
}

export default NotesService;
