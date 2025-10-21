import { CourseShift, FiltersDirectory } from './types';

export function buildQueryParams(filters: Partial<FiltersDirectory>): string {
  const params = Object.entries(filters)
    .filter(
      ([_, value]) => value !== undefined && value !== null && value !== '',
    )
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
    )
    .join('&');

  return params ? `?${params}` : '';
}

export const mapShiftToString = (shift: CourseShift) => {
  switch (shift) {
    case CourseShift.morning:
      return 'Mañana';
    case CourseShift.afternoon:
      return 'Tarde';
    case CourseShift.night:
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
