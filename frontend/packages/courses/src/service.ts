import { courses } from './constants';
import { Course, FiltersDirectory } from './types';

export const getCourses = (filters: FiltersDirectory, page: number) => {
  console.log(filters);
  return courses.filter(course => {
    const matchesCourseName =
      filters.courseName === '' ||
      course.title.toLowerCase().includes(filters.courseName.toLowerCase());
    const matchesTeacherName =
      filters.teacherName === '' ||
      course.instructor
        .toLowerCase()
        .includes(filters.teacherName.toLowerCase());
    const matchesYear =
      filters.year === '' || course.year.toString() === filters.year;
    const matchesShift =
      filters.shift === 'all' || course.shift === filters.shift;
    const matchesMyCourses = !filters.myCourses || course.isMyCourse;

    return (
      matchesCourseName &&
      matchesTeacherName &&
      matchesYear &&
      matchesShift &&
      matchesMyCourses
    );
  }) as Course[];
};
