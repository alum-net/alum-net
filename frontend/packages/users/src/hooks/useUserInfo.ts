import { useQuery } from '@tanstack/react-query';
import { getUserInfo } from '../service';
import { QUERY_KEYS } from '@alum-net/api';

export const useUserInfo = (invalidate = false) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: [QUERY_KEYS.getUserInfo, invalidate],
    queryFn: () => getUserInfo(invalidate),
    retry: 2,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
