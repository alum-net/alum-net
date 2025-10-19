import { useCallback, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { View, StyleSheet, Platform, FlatList } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { FiltersDirectory } from '../types';
import { getCourses } from '../service';
import { CourseCard } from '../components/course-card';
import { buildQueryParams } from '../helpers';
import { THEME } from '@alum-net/ui/src/constants';

export function CoursesDashboard({
  FilterComponent,
}: {
  FilterComponent: React.MemoExoticComponent<
    React.FC<{
      initialFilters: FiltersDirectory;
      onApplyFilters: (filters: FiltersDirectory) => void;
    }>
  >;
}) {
  const [appliedFilters, setAppliedFilters] = useState<FiltersDirectory>({
    courseName: '',
    teacherName: '',
    year: '',
    shift: 'all',
    myCourses: false,
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useQuery({
    queryKey: ['courses', buildQueryParams(appliedFilters), currentPage],
    queryFn: () => getCourses(appliedFilters, currentPage),
  });

  const handleApplyFilters = useCallback((filters: FiltersDirectory) => {
    setAppliedFilters(filters);
    setCurrentPage(1); // Reset to first page when filters change
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={
          <FilterComponent
            initialFilters={appliedFilters}
            onApplyFilters={handleApplyFilters}
          />
        }
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <CourseCard course={item} />}
        numColumns={Platform.OS === 'web' ? 4 : 2}
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
