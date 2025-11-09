import api, { Response } from '@alum-net/api';
import {
  GradeSubmissionsRequest,
  StudentGrade,
  StudentSummary,
  UnratedEvent,
} from './types';

export const getCourseStudents = async (courseId: string) => {
  return (
    await api.get<Response<StudentSummary[]>>(`/courses/${courseId}/students`)
  ).data;
};

export const getUnratedEvents = async (courseId: string) => {
  return (await api.get<Response<UnratedEvent[]>>(`/events/course/${courseId}`))
    .data;
};

export const getEventStudents = async (eventId: number) => {
  return (
    await api.get<Response<StudentGrade[]>>(`/events/${eventId}/students`)
  ).data;
};

export const getAutoCalculatedGrades = async (courseId: string) => {
  return (
    await api.get<Response<StudentSummary[]>>(`/courses/${courseId}/auto-grade`)
  ).data;
};

export const saveGrades = async (data: GradeSubmissionsRequest) => {
  return await api.post(
    `/${data.courseId ? 'courses' : 'events'}/grade-submissions`,
    data,
  );
};
