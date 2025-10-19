export type Course = {
  id: number;
  title: string;
  instructor: string;
  status: string;
  color: string;
  year: number;
  shift: CourseShift;
  isMyCourse: true;
};

export type CourseShift = 'morning' | 'night' | 'afternoon';

export interface FiltersDirectory {
  courseName: string;
  teacherName: string;
  year: string;
  shift: 'all' | CourseShift;
  myCourses: boolean;
}

export type FilterName = keyof FiltersDirectory;

export interface ShiftOption {
  label: string;
  value: 'all' | CourseShift;
}

export interface FilterBarRef {
  getFilters: () => FiltersDirectory;
}
