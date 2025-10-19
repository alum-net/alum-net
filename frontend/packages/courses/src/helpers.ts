import { FiltersDirectory } from './types';

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
