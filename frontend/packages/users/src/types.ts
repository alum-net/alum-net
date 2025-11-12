import { EventType } from '@alum-net/courses/src/types';

export enum UserRole {
  admin = 'ADMIN',
  teacher = 'TEACHER',
  student = 'STUDENT',
}

export interface UserInfo {
  role: UserRole;
  avatarUrl?: string;
  email: string;
  enabled: boolean;
  lastname: string;
  name: string;
}

export type UserFilterDTO = {
  name?: string;
  lastname?: string;
  email?: string;
  role?: UserRole | '';
};

export type AvatarFile = {
  uri?: string;
  filename?: string;
  type?: string;
};

export type UpdatePayload = {
  avatar: AvatarFile;
  name: string;
  lastname: string;
};

export type CalendarEvent = {
  courseId: number;
  courseName: string;
  description: string;
  endDate: string;
  eventId: number;
  startDate: string;
  title: string;
  type: EventType;
};

export interface AgendaEvent {
  hour: string;
  duration: string;
  title: string;
  itemCustomHeightType?: string;
}

export interface AgendaItem {
  title: string;
  data: AgendaEvent[];
}

export type Item = {
  hour: string;
  duration: string;
  title: string;
  eventData: CalendarEvent;
};
