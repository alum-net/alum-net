import { useEffect, useState } from 'react';
import { FiltersDirectory } from '../types';
import { useCourses } from './useCourses';

export const useCoursesFilters = (currentPage: number, enabled: boolean) => {
  const [appliedFilters, setAppliedFilters] = useState<FiltersDirectory>({});

  const { refetch } = useCourses({ appliedFilters, currentPage });

  useEffect(() => {
    if (enabled) refetch();
  }, [appliedFilters, enabled, refetch]);

  return { setAppliedFilters, appliedFilters };
};
