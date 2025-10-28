import { PageableContent } from '@alum-net/api';
import { UserInfo } from '@alum-net/users/src/types';

export type CourseDisplay = {
  id: string;
  name: string;
  teachers: UserInfo[];
  startDate: string;
  endDate: string;
  shift: CourseShift;
};

export type CourseCreationPayload = Omit<CourseDisplay, 'id' | 'teachers'> & {
  description: string;
  approvalGrade: number;
  teachersEmails: string[];
};

export enum CourseShift {
  morning = 'MORNING',
  evening = 'EVENING',
  afternoon = 'AFTERNOON',
}

export interface FiltersDirectory {
  name?: string;
  teacherEmail?: string;
  year?: string;
  shift?: CourseShift;
  myCourses?: boolean;
}

export type FilterName = keyof FiltersDirectory;

export interface ShiftOption {
  label: string;
  value: undefined | CourseShift;
}

export interface FilterBarRef {
  getFilters: () => FiltersDirectory;
}

export interface SectionResource {
  name: string;
  extension: string;
  url: string;
  order: number;
  id: number;
}

export interface Section {
  id: number;
  title: string;
  description: string;
  sectionResources: SectionResource[];
}

export interface CourseContent {
  sections: PageableContent<Section>;
  enrolledStudents?: string[];
  totalEnrollments?: number;
  description: string;
}
