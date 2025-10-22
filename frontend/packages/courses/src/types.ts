export type CourseDisplay = {
  id: number;
  name: string;
  teachersNames: string[];
  startDate: Date;
  endDate: Date;
  shift: CourseShift;
};

export type CourseCreationPayload = Omit<
  CourseDisplay,
  'id' | 'teachersNames'
> & {
  description: string;
  approvalGrade: number;
  teachersEmails: string[];
};

export enum CourseShift {
  morning = 'MORNING',
  night = 'NIGHT',
  afternoon = 'AFTERNOON',
}

export interface FiltersDirectory {
  courseName?: string;
  teacherName?: string;
  year?: string;
  shift?: 'all' | CourseShift;
  myCourses?: boolean;
}

export type FilterName = keyof FiltersDirectory;

export interface ShiftOption {
  label: string;
  value: 'all' | CourseShift;
}

export interface FilterBarRef {
  getFilters: () => FiltersDirectory;
}
