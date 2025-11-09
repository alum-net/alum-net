import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { UserRole } from '@alum-net/users';

export const useConversations = (userRole: UserRole | undefined) => {
  return useQuery({
    queryKey: [QUERY_KEYS.getConversations],
    queryFn: getConversations,
    enabled: userRole && userRole !== UserRole.admin,
    staleTime: 10_000,
    refetchOnWindowFocus: true,
  });
};
