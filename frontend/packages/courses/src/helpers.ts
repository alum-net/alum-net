import { CourseShift } from './types';

export const mapShiftToString = (shift: CourseShift) => {
  switch (shift) {
    case CourseShift.morning:
      return 'Mañana';
    case CourseShift.afternoon:
      return 'Tarde';
    case CourseShift.evening:
      return 'Noche';
  }
};

export function isValidDecimal(value: string): boolean {
  if (value.length > 3) return false;
  if (value.length === 0 || value === '0.') return true;
  const num = parseFloat(value);
  if (isNaN(num) || num < 0 || num > 1) {
    return false;
  }
  const decimalRegex = /^(0(\.\d)?|1(\.0)?|\.\d)$/;
  return decimalRegex.test(value);
}

export function deleteFalsyKeys<T extends Record<string, unknown>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, value]) =>
      Array.isArray(value) ? value.length > 0 : Boolean(value),
    ),
  ) as Partial<T>;
}
