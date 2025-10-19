import CourseFilters from '../components/courses-filters';
import { CoursesDashboard } from '@alum-net/courses';

export default function CoursesList() {
  return <CoursesDashboard filterComponent={CourseFilters} />;
}
