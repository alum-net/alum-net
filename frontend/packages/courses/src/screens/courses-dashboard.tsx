import { View, StyleSheet, Platform, FlatList } from 'react-native';
import { ActivityIndicator, Button, Text } from 'react-native-paper';
import { CourseCard } from '../components/course-card';
import { THEME } from '@alum-net/ui/src/constants';
import { useCoursesContext } from '../course-context';

export function CoursesDashboard({
  FilterComponent,
}: {
  FilterComponent: React.MemoExoticComponent<
    React.FC<{
      currentPage: number;
    }>
  >;
}) {
  const { currentPage, setPage, data, isLoading } = useCoursesContext();

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        ListHeaderComponent={<FilterComponent currentPage={currentPage} />}
        data={data?.data}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <CourseCard course={item} />}
        numColumns={Platform.OS === 'web' ? 4 : 2}
        columnWrapperStyle={styles.coursesGrid}
        key={Platform.OS === 'web' ? 'web' : 'mobile'}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator />
          ) : (
            <Text style={styles.noResults}>No se encontraron cursos</Text>
          )
        }
        ListFooterComponent={
          data && data.totalPages > 0 ? (
            <View style={styles.paginationContainer}>
              {data.pageNumber > 0 && (
                <Button
                  mode="contained-tonal"
                  onPress={() => setPage(currentPage - 1)}
                  buttonColor={THEME.colors.black}
                  labelStyle={styles.paginationButtonLabel}
                >
                  Página anterior
                </Button>
              )}
              {data.pageNumber < data.totalPages - 1 && (
                <Button
                  mode="contained-tonal"
                  onPress={() => setPage(currentPage + 1)}
                  buttonColor={THEME.colors.black}
                  labelStyle={styles.paginationButtonLabel}
                >
                  Página siguiente
                </Button>
              )}
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
