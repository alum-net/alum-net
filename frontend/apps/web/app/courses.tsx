import CourseFilters from '../features/courses/components/courses-filters';
import { CoursesDashboard } from '@alum-net/courses';

export default function CoursesList() {
  return <CoursesDashboard FilterComponent={CourseFilters} />;
}
