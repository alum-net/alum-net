import { Platform } from 'react-native';
import axios from 'axios';
import * as Device from 'expo-device';
import {
  accessTokenInterceptor,
  refreshTokenInterceptor,
} from './interceptors';

export const baseURL =
  Platform.OS === 'android' &&
  __DEV__ &&
  Device.isDevice &&
  process.env.EXPO_PUBLIC_ENV === 'development'
    ? 'http://10.0.2.2:8080/api/'
    : process.env.EXPO_PUBLIC_API_URI;

const api = axios.create({
  baseURL: `${baseURL}/`,
});

api.interceptors.request.use(accessTokenInterceptor);
api.interceptors.response.use(res => res, refreshTokenInterceptor);

export default api;
