import React, { createContext, useContext, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { getCourses } from './service';
import { FiltersDirectory } from './types';
import { useUserInfo } from '@alum-net/users';

type CoursesContextValue = {
  data: any;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  appliedFilters: FiltersDirectory | undefined;
  currentPage: number;
  setFilters: (filters?: FiltersDirectory) => void;
  setPage: (page: number) => void;
};

const CoursesContext = createContext<CoursesContextValue | undefined>(
  undefined,
);

export const CourseContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { data: userInfo } = useUserInfo();

  const [appliedFilters, setAppliedFilters] = useState<
    FiltersDirectory | undefined
  >(undefined);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.getCourses, appliedFilters, currentPage],
    queryFn: () =>
      getCourses(currentPage, userInfo!.email, appliedFilters ?? {}),
    enabled: !!userInfo?.email,
  });

  const setFilters = useCallback((filters?: FiltersDirectory) => {
    setAppliedFilters(filters);
    setCurrentPage(0); // reset page when filters change
  }, []);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const value: CoursesContextValue = {
    data,
    isLoading,
    error,
    refetch,
    appliedFilters,
    currentPage,
    setFilters,
    setPage,
  };

  return (
    <CoursesContext.Provider value={value}>{children}</CoursesContext.Provider>
  );
};

// Hook for easy access
export const useCoursesContext = () => {
  const context = useContext(CoursesContext);
  if (!context) {
    throw new Error('useCoursesContext must be used within a CoursesProvider');
  }
  return context;
};
