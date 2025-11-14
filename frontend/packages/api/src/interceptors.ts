import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { logout, refresh } from '@alum-net/auth';
import { Response } from './types';
import { Platform } from 'react-native';
import { Toast } from '@alum-net/ui';

export const accessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};

export const refreshTokenInterceptor = async (error: AxiosError<Response>) => {
  const originalRequest:
    | (InternalAxiosRequestConfig & { _isRetry?: boolean })
    | undefined = error.config;

  if (!originalRequest) throw Error('No original request');

  if (error.response?.status !== 401) return Promise.reject(error);

  try {
    storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
    const newAccessToken = await refresh();
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    originalRequest._isRetry = true;

    return axios.request(originalRequest);
  } catch (error) {
    console.log(error);
    return await logout();
  }
};

export const notificationHandlerInterceptor = (
  response: AxiosResponse<Response>,
) => {
  if (Platform.OS !== 'web') return response;
  if (response.data.notifications && response.data.notifications.length > 0) {
    response.data.notifications.forEach(notification => {
      Toast.info(notification.message, 5000, 'top');
    });
  }
  return response;
};
