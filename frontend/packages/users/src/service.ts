import { UserInfo, UserRole } from './types';

export const getUserInfo = async (): Promise<UserInfo> => {
  return {
    role: UserRole.admin,
    email: '',
    enabled: true,
    lastname: '',
    name: '',
  };
};
