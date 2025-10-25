import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'application',
});

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  ID_TOKEN: 'idToken',
  REFRESH_TOKEN: 'refreshToken',
  USER_INFO: 'userInfo',
};
