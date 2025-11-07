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
  summaryEvents: SummaryEvent[];
}

export type SummaryEvent = {
  id: number;
  type: EventType;
  title: string;
};

export interface CourseContent {
  sections: PageableContent<Section>;
  enrolledStudents?: string[];
  totalEnrollments?: number;
  description: string;
}

export enum EventType {
  QUESTIONNAIRE = 'QUESTIONNAIRE',
  ONSITE = 'ONSITE',
  TASK = 'TASK',
}

export interface Answer {
  correct: boolean;
  id: number;
  text: string;
}

export interface Question {
  id: number;
  text: string;
  answers: Answer[];
  correctOption: number;
}

export interface Event {
  description: string;
  startDate: string;
  endDate: string;
  maxGrade: number;
  studentsWithPendingSubmission: string[];
  questions?: Question[];
  durationInMinutes?: number;
  title: string;
}

export type Homework = {
  eventId: string;
  studentEmail: string;
  homeworkFile: FilesToUpload;
};

export type FilesToUpload = {
  uri: string;
  name: string;
  type: string;
};
