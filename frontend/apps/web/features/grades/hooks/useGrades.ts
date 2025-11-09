import { useQuery, useMutation } from '@tanstack/react-query';
import {
  getCourseStudents,
  getUnratedEvents,
  getEventStudents,
  getAutoCalculatedGrades,
  saveGrades,
} from '../service';
import { GradeSubmissionsRequest } from '../types';
import { QUERY_KEYS } from '@alum-net/api';

export const useGrades = (courseId: string, eventId?: number) => {
  const {
    data: students,
    isLoading: isLoadingStudents,
    refetch: getStudents,
  } = useQuery({
    queryKey: [QUERY_KEYS.getCourseStudents, courseId],
    queryFn: () => getCourseStudents(courseId),
    enabled: false,
  });

  const { data: unratedEvents, isLoading: isLoadingUnratedEvents } = useQuery({
    queryKey: [QUERY_KEYS.getUnratedEvents, courseId],
    queryFn: () => getUnratedEvents(courseId),
    staleTime: Infinity,
  });

  const { data: eventStudents } = useQuery({
    queryKey: [QUERY_KEYS.getEventStudents, eventId],
    queryFn: () => getEventStudents(eventId!),
    enabled: !!eventId,
  });

  const {
    data: autoGrades,
    refetch: getCalculatedGrades,
    isLoading: fetchingCalculatedGrades,
  } = useQuery({
    queryKey: [QUERY_KEYS.getAutoGrades, courseId],
    queryFn: () => getAutoCalculatedGrades(courseId),
    enabled: false,
  });

  const { mutate: saveGradesMutation, isPending: isSavingGrades } = useMutation(
    {
      mutationFn: (data: GradeSubmissionsRequest) => saveGrades(data),
    },
  );

  return {
    students,
    isLoadingStudents,
    unratedEvents,
    isLoadingUnratedEvents,
    eventStudents,
    getCalculatedGrades,
    autoGrades,
    saveGrades: saveGradesMutation,
    isSavingGrades,
    getCourseStudents: getStudents,
    fetchingCalculatedGrades,
  };
};
