import { useQuery } from '@tanstack/react-query';
import { UserInfo } from '../types';
import { getUserInfo } from '../service';

export const useUserInfo = () => {
  const { data, isLoading, refetch } = useQuery<UserInfo>({
    queryKey: ['userInfo'],
    queryFn: getUserInfo,
    // enabled: false,
    retry: 2,
  });

  return {
    userInfo: data,
    isLoading,
    refetch,
  };
};
