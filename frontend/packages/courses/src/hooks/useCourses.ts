import { QUERY_KEYS } from '@alum-net/api';
import { useQuery } from '@tanstack/react-query';
import { getCourses } from '../service';
import { FiltersDirectory } from '../types';

export const useCourses = ({
  appliedFilters = undefined,
  currentPage = 0,
}: {
  appliedFilters?: FiltersDirectory;
  currentPage?: number;
}) => {
  const { data, refetch, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.getCourses],
    queryFn: () => getCourses(appliedFilters, currentPage),
    enabled: false,
    staleTime: Infinity,
  });

  return { data, refetch, isLoading, error };
};
