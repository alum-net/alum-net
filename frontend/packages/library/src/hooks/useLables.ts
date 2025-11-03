import { useQuery } from '@tanstack/react-query';
import { getLabels } from '../service';
import { QUERY_KEYS } from '@alum-net/api';

export const useLabels = () => {
  const { data, isLoading } = useQuery({
    queryFn: getLabels,
    queryKey: [QUERY_KEYS.getLibraryLabels],
    retry: 0,
    staleTime: Infinity,
  });

  return {
    data,
    isLoading,
  };
};
