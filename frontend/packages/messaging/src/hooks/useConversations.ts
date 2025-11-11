import { useQuery } from '@tanstack/react-query';
import { getConversations } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { UserRole } from '@alum-net/users';

export const useConversations = (userRole: UserRole | undefined) => {
  const refetch = userRole && userRole !== UserRole.admin;
  return useQuery({
    queryKey: [QUERY_KEYS.getConversations],
    queryFn: () => (refetch ? getConversations() : []),
    enabled: refetch,
    staleTime: 10_000,
    refetchOnWindowFocus: refetch,
  });
};
