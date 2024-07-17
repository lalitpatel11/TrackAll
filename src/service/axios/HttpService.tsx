//external imports
import AsyncStorage from '@react-native-async-storage/async-storage';
//internal imports
import Axios from './AxiosHttpService';
import AxiosInterceptor from './AxiosInterceptor';

class Http extends Axios {
  public static async headerBuilder() {
    let token = await AsyncStorage.getItem('authToken');
    let headers = {
      headers: {
        Authorization: `Bearer ${token}`,
        'content-type': 'multipart/form-data',
      },
    };
    return headers;
  }

  public static async delete(url: string): Promise<any> {
    // let headers = await this.headerBuilder();
    this.InjectMiddleware();
    return await Axios.delete(url);
  }

  public static async get(url: string, headers?: any): Promise<any> {
    headers = await this.headerBuilder();
    this.InjectMiddleware();
    return await Axios.get(url, headers);
  }

  public static async post(
    url: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    headers = await this.headerBuilder();
    this.InjectMiddleware();
    return await Axios.post(url, data, headers);
  }

  public static async put(
    url: string,
    data?: any,
    headers?: any,
  ): Promise<any> {
    headers = await this.headerBuilder();
    this.InjectMiddleware();
    return await Axios.put(url, data, headers);
  }

  public static async xRequests(requests: any[]): Promise<any[]> {
    this.InjectMiddleware();
    return await Axios.all(requests);
  }

  private static InjectMiddleware() {
    this.SubscribeRequestInterceptor();
    this.SubscribeResponseInterceptor();
  }

  private static SubscribeRequestInterceptor() {
    AxiosInterceptor.subscribeRequest();
  }

  private static SubscribeResponseInterceptor() {
    AxiosInterceptor.subscribeResponse();
  }
}

export default Http;
