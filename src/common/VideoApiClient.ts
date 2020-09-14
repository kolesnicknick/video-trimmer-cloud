import axios, { AxiosResponse } from 'axios';
import {
  VIDEO_API, VideoStatus,
} from './constants';

export class VideoApiClient {

  login: string;

  password: string;

  baseUrl: string = VIDEO_API;

  token: string;

  constructor(login: string, password: string) {
    this.login = login;
    this.password = password;
  }

  updateStatus = async (id: string, status: VideoStatus): Promise<AxiosResponse> => {
    await this.setToken();
    return await axios.patch(`/api/v1/video/${id}/status`, { status });
  };

  updateUrl = async (id: string, trimmedPath: string): Promise<AxiosResponse> => {
    await this.setToken();
    return await axios.patch(`/api/v1/video/${id}/url`, { path: trimmedPath });
  };

  getVideoToTrim = async (): Promise<AxiosResponse> => {
    await this.setToken();
    return await axios.get('api/video/get-latest');
  };

  private authorize = async (login = this.login, password = this.password) =>
    (await axios.post(`${this.baseUrl}/login`, {
    username: login,
    password,
  }, { headers: { 'content-type': 'application/json' } })).data;

  private async setToken() {
    if (!this.token) {
      this.token = (await this.authorize()).access_token;
    }
  }
}
