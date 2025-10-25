import CourseFilters from '../features/courses/components/courses-filters';
import { CoursesDashboard, CourseContextProvider } from '@alum-net/courses';

export default function CoursesList() {
  return (
    <CourseContextProvider>
      <CoursesDashboard FilterComponent={CourseFilters} />
    </CourseContextProvider>
  );
}
