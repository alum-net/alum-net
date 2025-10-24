import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { getCourseMembers } from '../service';

export const useCourseMembers = (courseId: string, page = 0, size = 10) => {
  const q = useQuery({
    queryKey: [QUERY_KEYS.getCourseMembers, courseId, page, size],
    queryFn: () => getCourseMembers(courseId, page, size),
    staleTime: 30_000
  });

  return {
    data: q.data,
    isLoading: q.isLoading,
    isFetching: q.isFetching,
    error: q.error,
  };
};
