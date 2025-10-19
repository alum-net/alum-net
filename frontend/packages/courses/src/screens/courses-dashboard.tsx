import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { View, ScrollView, StyleSheet, Platform } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { FiltersDirectory, FilterName, CourseShift } from '../types';
import { getCourses } from '../service';
import { CourseCard } from '../components/course-card';
import { buildQueryParams } from '../helpers';
import { THEME } from '@alum-net/ui/src/constants';

const timeoutDelay = 500;

export function CoursesDashboard({
  filterComponent,
}: {
  filterComponent: ({
    filters,
    setFilters,
  }: {
    filters: FiltersDirectory;
    setFilters: (filterName: FilterName, value?: string | boolean) => void;
  }) => ReactNode;
}) {
  const [courseName, setCourseName] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [year, setYear] = useState('');
  const [shift, setShift] = useState<CourseShift | 'all'>('all');
  const [myCourses, setMyCourses] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const filters = useMemo(
    () => ({
      courseName: courseName,
      teacherName: teacherName,
      shift: shift,
      year: year,
      myCourses: myCourses,
    }),
    [courseName, teacherName, shift, year, myCourses],
  );
  const filtersTimeout = useRef<NodeJS.Timeout>();
  const { data } = useQuery({
    queryKey: ['courses', buildQueryParams(filters), currentPage],
    queryFn: () => getCourses(filters, currentPage),
  });

  const setFilters = useCallback(
    (filterName: FilterName, value?: string | boolean) => {
      switch (filterName) {
        case 'courseName':
          if (filtersTimeout.current) clearTimeout(filtersTimeout.current);
          filtersTimeout.current = setTimeout(() => {
            setCourseName(value as string);
          }, timeoutDelay);
          break;
        case 'teacherName':
          if (filtersTimeout.current) clearTimeout(filtersTimeout.current);
          filtersTimeout.current = setTimeout(() => {
            setTeacherName(value as string);
          }, timeoutDelay);
          break;
        case 'year':
          if (filtersTimeout.current) clearTimeout(filtersTimeout.current);
          filtersTimeout.current = setTimeout(() => {
            setYear(value as string);
          }, timeoutDelay);
          break;
        case 'shift':
          setShift(value as CourseShift | 'all');
          break;
        case 'myCourses':
          setMyCourses(value as boolean);
          break;
        default:
          break;
      }
    },
    [],
  );

  return (
    <View style={styles.container}>
      {filterComponent({ setFilters, filters })}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.coursesGrid}
      >
        {data?.map(course => (
          <CourseCard key={course.id} course={course} />
        ))}
        {data?.length === 0 ? (
          <Text style={styles.noResults}>No se encontraron cursos</Text>
        ) : (
          <View style={styles.paginationContainer}>
            {/* TODO: revisar como usar la logica del paginado */}
            <Button
              mode="contained-tonal"
              onPress={() => setCurrentPage(currentPage - 1)}
              buttonColor={THEME.colors.black}
              labelStyle={styles.paginationButtonLabel}
            >
              Página anterior
            </Button>
            <Button
              mode="contained-tonal"
              onPress={() => setCurrentPage(currentPage + 1)}
              buttonColor={THEME.colors.black}
              labelStyle={styles.paginationButtonLabel}
            >
              Página siguiente
            </Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    elevation: 0,
    borderBottomWidth: 1,
  },
  scrollView: {
    flex: 1,
  },
  coursesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 16,
    justifyContent: Platform.OS === 'web' ? 'flex-start' : 'space-between',
  },
  noResults: {
    color: 'red',
    textAlign: 'center',
    marginTop: 32,
    fontSize: 16,
    width: '100%',
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  paginationButtonLabel: {
    color: 'white',
  },
});
