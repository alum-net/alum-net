import { CourseContextProvider, CoursesDashboard } from '@alum-net/courses';
import CourseFilters from '../../components/courses-filters';
import Screen from '../../components/screen';

export default function CoursesSearch() {
  return (
    <CourseContextProvider>
      <Screen scrollable={false} edges={['top']}>
        <CoursesDashboard FilterComponent={CourseFilters} />
      </Screen>
    </CourseContextProvider>
  );
}
