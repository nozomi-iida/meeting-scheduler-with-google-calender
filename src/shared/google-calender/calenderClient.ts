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
