import axios from 'axios';

import { getGoogleAuthToken } from '../utils';

export const calenderClient = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3',
});

calenderClient.interceptors.request.use(async (config) => {
  const token = await getGoogleAuthToken();
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

calenderClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      // tokenがなかった場合
      // ここでログイン画面に飛ばす
      console.log('tokenがなかった場合');
    }
    return Promise.reject(error);
  }
);
