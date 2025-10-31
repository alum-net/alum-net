import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../service';
import { QUERY_KEYS } from '@alum-net/api';

export const useUserInfo = () => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.getUserInfo],
    queryFn: getUserInfo,
    retry: 2,
  });

  return {
    data: data,
    isLoading,
    refetch,
  };
};
