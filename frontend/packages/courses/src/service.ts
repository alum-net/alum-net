import api, { PageableResponse, Response } from '@alum-net/api';
import {
  CourseDisplay,
  FiltersDirectory,
  CourseCreationPayload,
  CourseContent,
  Event as Event,
  Homework,
} from './types';
import { AxiosResponse } from 'axios';
import { UserInfo } from '@alum-net/users/src/types';
import { deleteFalsyKeys } from './helpers';
import { Platform } from 'react-native';

function mapFilterKeys(filters: FiltersDirectory, userEmail: string) {
  return {
    name: filters.name,
    teacherEmail: filters.teacherEmail,
    year: filters.year,
    shift: filters.shift,
    userEmail: filters.myCourses ? userEmail : undefined,
  };
}

export const getCourses = async (
  page: number = 0,
  userEmail: string,
  filters: FiltersDirectory,
) => {
  const { data }: AxiosResponse<PageableResponse<CourseDisplay>> =
    await api.get('/courses/', {
      params: deleteFalsyKeys({
        ...mapFilterKeys(filters, userEmail),
        page: page,
      }),
    });
  return data;
};

export const createCourse = async (courseInfo: CourseCreationPayload) => {
  const { data }: AxiosResponse<Response> = await api.post(
    '/courses',
    courseInfo,
  );

  return data;
};

export const deleteCourse = async (courseId: string) => {
  await api.delete(`/courses/${courseId}`);
};

export const fetchCourse = async (courseId: string, userEmail: string) => {
  const { data }: AxiosResponse<Response<CourseContent>> = await api.get(
    `/courses/${courseId}/content/?userId=${userEmail}&size=300`,
  );

  return data;
};

export const getCourseMembers = async (
  courseId: string,
  page = 0,
  size = 10,
) => {
  const { data } = await api.get<PageableResponse<UserInfo>>(
    `/courses/${courseId}/members`,
    { params: { page, size } },
  );
  return data;
};

export const enrollStudent = async (courseId: string, email: string) => {
  const payload = { studentEmail: email };
  const { data } = await api.post<Response>(
    `/courses/${courseId}/participations`,
    payload,
  );
  return data;
};

export const unenrollStudent = async (courseId: string, email: string) => {
  const res = await api.delete(
    `/courses/${courseId}/participations/${encodeURIComponent(email)}`,
  );

  const body: any = res.data ?? {};
  const normalized = {
    success: body?.success ?? res.status === 204,
    message:
      body?.message ??
      (res.status === 204 ? 'Estudiante desmatriculado correctamente' : ''),
    errors: body?.errors,
    data: body?.data,
    statusCode: res.status,
  };

  return normalized;
};

export const getEventById = async (eventId: string) => {
  const { data }: AxiosResponse<Response<Event>> = await api.get(
    `/events/${eventId}`,
  );
  return data.data;
};

export const submitHomework = async (homework: Homework) => {
  const data = new FormData();

  data.append(
    'homeworkFile',
    Platform.OS === 'web'
      ? await (await fetch(homework.homeworkFile.uri)).blob()
      : ({
          name: homework.homeworkFile.name,
          uri: homework.homeworkFile.uri,
          type: homework.homeworkFile.type,
        } as any),
    homework.homeworkFile.name,
  );

  return await api.post(
    `/events/${homework.eventId}/submit-homework?studentEmail=${homework.studentEmail}`,
    data,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );
};

export const deleteEvent = async (id: number) => {
  return await api.delete(`/events/${id}`);
};

export type QuestionnaireResponse = {
  questionId: number;
  answerId: number;
  isCorrect: boolean;
  timeStamp?: string;
};

export type SubmitQuestionnaireRequest = {
  userEmail?: string;
  responses: QuestionnaireResponse[];
};

export const submitQuestionnaireResponses = async (
  eventId: number | string,
  payload: SubmitQuestionnaireRequest,
) => {
  return await api.post<Response>(`/events/${eventId}/submit`, payload);
};

import { CourseGradesResponse } from './types';

export const getGrades = async (courseId: number, userEmail: string) => {
  const { data }: AxiosResponse<Response<CourseGradesResponse>> = await api.get(
    `/courses/${courseId}/grades/${userEmail}`,
  );
  if (!data.data) {
    throw new Error('No grades data found');
  }
  return data.data;
};