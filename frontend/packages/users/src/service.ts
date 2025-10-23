import { getKeyclaokUserInfo } from '@alum-net/auth';
import { UserInfo } from './types';
import api, { PageableResponse } from '@alum-net/api';
import { AxiosResponse } from 'axios';

export const getUserInfo = async () => {
  const userInfo = await getKeyclaokUserInfo();
  console.log(userInfo.email);
  const { data }: AxiosResponse<PageableResponse<UserInfo>> = await api.get(
    '/users/',
    {
      params: {
        size: 1,
        email: userInfo.email,
      },
    },
  );

  return data.data?.[0];
};
