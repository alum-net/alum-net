import { courses } from './constants';
import api, { Response } from '@alum-net/api';
import {
  CourseDisplay,
  FiltersDirectory,
  CourseCreationPayload,
} from './types';
import { AxiosResponse } from 'axios';

export const getCourses = (filters?: FiltersDirectory, page: number = 1) => {
  console.log(filters, page, 'getCourses');
  if (!filters) return courses;
  console.log('filtro');
  return courses.filter(course => {
    const matchesCourseName =
      !filters.courseName ||
      (filters.courseName &&
        course.name
          .toLowerCase()
          .includes(filters.courseName?.toLowerCase() || ''));

    const matchesTeacherName =
      !filters.teacherName ||
      (filters.teacherName &&
        course.teachersNames.some(teacher =>
          teacher
            .toLowerCase()
            .includes(filters.teacherName?.toLowerCase() || ''),
        ));

    const matchesShift =
      !filters.shift ||
      filters.shift === 'all' ||
      course.shift === filters.shift;
    console.log(
      'entra? ',
      matchesCourseName && matchesTeacherName && matchesShift,
    );
    return matchesCourseName && matchesTeacherName && matchesShift;
  }) as CourseDisplay[];
};

export const createCourse = async (courseInfo: CourseCreationPayload) => {
  const { data }: AxiosResponse<Response> = await api.post(
    '/courses',
    courseInfo,
  );

  return data;
};

export const deleteCourse = async (courseId: number) => {
  await api.delete(`/courses/${courseId}`);
};
