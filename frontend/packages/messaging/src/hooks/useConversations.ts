import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { useUserInfo } from '@alum-net/users';
import { UserRole } from '@alum-net/users/src/types';

export const useConversations = () => {
  const { data: userInfo, isLoading: isLoadingUserInfo } = useUserInfo();
  const isTeacher = userInfo?.role === UserRole.teacher;
  
  return useQuery({
    queryKey: [QUERY_KEYS.getConversations],
    queryFn: getConversations,
    enabled: !isLoadingUserInfo && isTeacher && !!userInfo,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });

};
