import { ShiftOption, CourseShift } from './types';

export const SHIFTS: ShiftOption[] = [
  { label: 'Todos los turnos', value: undefined },
  { label: 'Mañana', value: CourseShift.morning },
  { label: 'Tarde', value: CourseShift.afternoon },
  { label: 'Noche', value: CourseShift.evening },
];

export const PERMITTED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'video/mp4',
  'image/jpeg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/zip',
];
