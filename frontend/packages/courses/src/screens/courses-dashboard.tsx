import { ReactNode, useCallback, useMemo, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet, Platform, FlatList } from 'react-native';
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
  const filtersTimeout = useRef<NodeJS.Timeout | number>();
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
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={() => filterComponent({ setFilters, filters })}
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <CourseCard course={item} />}
        numColumns={Platform.OS === 'web' ? undefined : 2}
        columnWrapperStyle={styles.coursesGrid}
        key={Platform.OS === 'web' ? 'web' : 'mobile'}
        ListEmptyComponent={
          <Text style={styles.noResults}>No se encontraron cursos</Text>
        }
        ListFooterComponent={
          data && data.length > 0 ? (
            <View style={styles.paginationContainer}>
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
          ) : null
        }
      />
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
  flatList: {
    flex: 1,
    padding: 8,
  },
  coursesGrid: { gap: 15, justifyContent: 'space-around' },
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
    marginVertical: 16,
  },
  paginationButtonLabel: {
    color: 'white',
  },
});
