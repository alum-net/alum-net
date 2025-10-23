import { PageableContent } from '@alum-net/api';
import { UserInfo } from '@alum-net/users/src/types';

export type CourseDisplay = {
  id: string;
  name: string;
  teachers: UserInfo[];
  startDate: string;
  endDate: string;
  shiftType: CourseShift;
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
  teacherName?: string;
  year?: string;
  shiftType?: CourseShift;
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
  title: string;
  name: string;
  extension: string;
  url: string;
}

export interface Section {
  title: string;
  description: string;
  sectionResources: SectionResource[];
}

export interface CourseContent {
  sections: PageableContent<Section>;
  enrolledStudents?: string[];
  totalEnrollments?: number;
}
