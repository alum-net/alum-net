import api, { PageableResponse, Response } from '@alum-net/api';
import {
  CourseDisplay,
  FiltersDirectory,
  CourseCreationPayload,
  CourseContent,
} from './types';
import { AxiosResponse } from 'axios';
import { UserInfo } from '@alum-net/users/src/types';

function deleteFalsyKeys<T extends Record<string, any>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => Boolean(value)),
  ) as Partial<T>;
}

export const getCourses = async (
  filters?: FiltersDirectory,
  page: number = 0,
) => {
  const { data }: AxiosResponse<PageableResponse<CourseDisplay>> =
    await api.get('/courses/', { params: filters && deleteFalsyKeys(filters) });
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
    `/courses/${courseId}/content/?userId=${userEmail}`,
  );

  return data;
};


export const getCourseMembers = async (courseId: string, page = 0, size = 10) => {
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
  const res = await api.delete(`/courses/${courseId}/participations/${encodeURIComponent(email)}`);

  const body: any = res.data ?? {};
  const normalized = {
    success: body?.success ?? (res.status === 204),
    message:
      body?.message ??
      (res.status === 204 ? 'Estudiante desmatriculado correctamente' : ''),
    errors: body?.errors,
    data: body?.data,
    statusCode: res.status,
  };

  return normalized;
};
