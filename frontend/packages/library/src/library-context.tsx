import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import { PageableResponse, QUERY_KEYS } from '@alum-net/api';
import { getResources } from './service';
import { LibraryResource, LibraryResourceFilter } from './types';

type LibraryContextValue = {
  data: PageableResponse<LibraryResource> | undefined;
  isLoading: boolean;
  error: unknown;
  refetch: () => void;
  currentPage: number;
  setPage: (page: number) => void;
  appliedFilters: LibraryResourceFilter | undefined;
  setFilters: (filters?: LibraryResourceFilter) => void;
  nameFilter: string;
  setNameFilter: (name: string) => void;
};

const LibraryContext = createContext<LibraryContextValue | undefined>(
  undefined,
);

export const LibraryContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [appliedFilters, setAppliedFilters] = useState<
    LibraryResourceFilter | undefined
  >(undefined);
  const [nameFilter, setNameFilter] = useState(appliedFilters?.name || '');

  useEffect(() => {
    const handler = setTimeout(() => {
      setAppliedFilters(prev => ({ ...prev, name: nameFilter }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [nameFilter]);

  const { data, refetch, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.getLibraryResources, currentPage, appliedFilters],
    queryFn: () => getResources(currentPage, appliedFilters),
  });

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const setFilters = useCallback((filters?: LibraryResourceFilter) => {
    setAppliedFilters(filters);
    setCurrentPage(0);
  }, []);

  const value: LibraryContextValue = {
    data,
    isLoading,
    error,
    refetch,
    currentPage,
    setPage,
    appliedFilters,
    setFilters,
    nameFilter,
    setNameFilter,
  };

  return (
    <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>
  );
};

export const useLibraryContext = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibraryContext must be used within a LibraryProvider');
  }
  return context;
};
