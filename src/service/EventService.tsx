//internal imports
import {API} from './api/ApiDetails';
import Http from './axios/HttpService';

class EventService {
  public static async postSharedEvents(locationData: any) {
    const url = `${API.POST_SHARED_EVENTS}`;
    const response = await Http.post(url, locationData);
    return response;
  }

  public static async postSearchSharedEvents(eventData: any) {
    const url = `${API.POST_SHARED_EVENTS}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postMyEvents(locationData: any) {
    const url = `${API.POST_MY_EVENTS}`;
    const response = await Http.post(url, locationData);
    return response;
  }

  public static async postSearchMyEvents(eventData: any) {
    const url = `${API.POST_MY_EVENTS}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async getEventDetails(eventId: any) {
    const url = `${API.GET_EVENT_DETAILS}/${eventId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getDeleteEvent(eventId: any) {
    const url = `${API.GET_DELETE_EVENT}/${eventId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postShareEvent(eventData: any) {
    const url = `${API.POST_SHARE_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postLikeUnlikeEvent(eventData: any) {
    const url = `${API.POST_LIKE_UNLIKE_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async getAllCommentsOnEvent(eventId: any) {
    const url = `${API.GET_ALL_COMMENTS_ON_EVENT}/${eventId}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postAddEventComments(eventData: any) {
    const url = `${API.POST_ADD_EVENT_COMMENTS}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postCreateEvent(eventData: any) {
    const url = `${API.POST_CREATE_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postEditEvent(eventData: any) {
    const url = `${API.POST_EDIT_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postUploadImageOnEvent(eventData: any) {
    const url = `${API.POST_UPLOAD_IMAGE_ON_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postViewAllEventMember(eventData: any) {
    const url = `${API.POST_VIEW_ALL_EVENT_MEMBERS}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async postRemoveEventMember(eventData: any) {
    const url = `${API.POST_REMOVE_EVENT_MEMBER}`;
    const response = await Http.post(url, eventData);
    return response;
  }

  public static async getEventAddress(getEventAddress: any) {
    const apiKey = 'AIzaSyBs8nZfTan-Bubzz5lBomTqY-ImM5wi2zM';
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${getEventAddress}&key=${apiKey}`;
    const response = await Http.get(url);
    return response;
  }

  public static async getLocationAddress(lat: number, lng: number) {
    const apiKey = 'AIzaSyBs8nZfTan-Bubzz5lBomTqY-ImM5wi2zM';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&sensor=true/false&key=${apiKey}`;
    const response = await Http.get(url);
    return response;
  }

  public static async postNearByEvent(eventData: any) {
    const url = `${API.POST_NEAR_BY_EVENT}`;
    const response = await Http.post(url, eventData);
    return response;
  }
}
export default EventService;
