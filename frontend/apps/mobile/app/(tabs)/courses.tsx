import { CoursesDashboard } from '@alum-net/courses';
import CourseFilters from '../../components/courses-filters';

export function CoursesSearch() {
  return <CoursesDashboard filterComponent={CourseFilters} />;
}
