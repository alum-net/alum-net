import { EventType } from '@alum-net/courses';

export type StudentSummary = {
  name: string;
  lastname: string;
  email: string;
  calculatedGrade?: number;
  approved?: boolean;
  finalGrade?: number | null;
};

export type StudentGrade = {
  name: string;
  lastname: string;
  email: string;
  grade: number | null;
};

export type GradeSubmission = {
  name: string;
  lastname: string;
  email: string;
  grade: number | string | null;
};

export type GradeSubmissionsRequest = {
  students: GradeSubmission[];
  eventId?: string;
  courseId?: string;
};

export type UnratedEvent = {
  id: number;
  title: string;
  maxGrade: number;
  type: EventType;
};
