import api, { PageableResponse, Response } from '@alum-net/api';
import {
  CourseDisplay,
  FiltersDirectory,
  CourseCreationPayload,
} from './types';
import { AxiosResponse } from 'axios';

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
