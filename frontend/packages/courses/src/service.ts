import { courses } from './constants';
import api, { Response } from '@alum-net/api';
import {
  CourseDisplay,
  FiltersDirectory,
  CourseCreationPayload,
} from './types';
import { AxiosResponse } from 'axios';

export const getCourses = (filters: FiltersDirectory, page: number) => {
  console.log(filters);
  return courses.filter(course => {
    const matchesCourseName =
      filters.courseName ||
      course.name
        .toLowerCase()
        .includes(filters.courseName?.toLowerCase() || '');

    const matchesTeacherName =
      filters.teacherName ||
      course.teachersNames.some(teacher =>
        teacher
          .toLowerCase()
          .includes(filters.teacherName?.toLowerCase() || ''),
      );

    const matchesShift =
      filters.shift === 'all' || course.shift === filters.shift;

    return matchesCourseName && matchesTeacherName && matchesShift;
  }) as CourseDisplay[];
};

export const createCourse = async (courseInfo: CourseCreationPayload) => {
  console.log(courseInfo, 'creacion de curso');
  const { data }: AxiosResponse<Response> = await api.post(
    '/courses',
    courseInfo,
  );

  return data;
};
