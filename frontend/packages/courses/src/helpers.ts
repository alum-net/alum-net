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
    case 'MORNING':
      return 'Mañana';
    case 'AFTERNOON':
      return 'Tarde';
    case 'NIGHT':
      return 'Noche';
  }
};
