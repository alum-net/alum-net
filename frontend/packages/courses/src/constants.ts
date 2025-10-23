import { ShiftOption, CourseShift } from './types';

export const SHIFTS: ShiftOption[] = [
  { label: 'Todos los turnos', value: undefined },
  { label: 'Mañana', value: CourseShift.morning },
  { label: 'Tarde', value: CourseShift.afternoon },
  { label: 'Noche', value: CourseShift.evening },
];
