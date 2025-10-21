import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { logout, refresh } from '@alum-net/auth';

export const accessTokenInterceptor = (config: InternalAxiosRequestConfig) => {
  const token = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);

  if (token) {
    console.log('access ', token);
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

  if (!storage.getString(STORAGE_KEYS.REFRESH_TOKEN)) return await logout();

  try {
    storage.delete(STORAGE_KEYS.ACCESS_TOKEN);
    const newAccessToken = await refresh();
    console.log('tiro la request de nuevo');
    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
    originalRequest._isRetry = true;

    return axios.request(originalRequest);
  } catch (e) {
    console.log(e);
    return await logout();
  }
};
