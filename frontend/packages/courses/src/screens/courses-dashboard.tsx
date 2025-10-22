import { useState } from 'react';
import { View, StyleSheet, Platform, FlatList } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { CourseCard } from '../components/course-card';
import { THEME } from '@alum-net/ui/src/constants';
import { useCourses } from '../hooks/useCourses';

export function CoursesDashboard({
  FilterComponent,
}: {
  FilterComponent: React.MemoExoticComponent<
    React.FC<{
      currentPage: number;
    }>
  >;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { data } = useCourses({});

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={<FilterComponent currentPage={currentPage} />}
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
