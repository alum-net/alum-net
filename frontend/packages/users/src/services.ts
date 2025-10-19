import { UserInfo } from './types';

export const getUserInfo = async (): Promise<UserInfo> => {
  return { role: 'student' };
};
