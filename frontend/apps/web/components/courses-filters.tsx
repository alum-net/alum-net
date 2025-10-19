import { FilterBar } from '@alum-net/courses';
import { FilterName, FiltersDirectory } from '@alum-net/courses/src/types';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

export default function CourseFilters({
  filters,
  setFilters,
}: {
  filters: FiltersDirectory;
  setFilters: (filterName: FilterName, value?: string | boolean) => void;
}) {
  const { userInfo } = useUserInfo();
  return (
    <View>
      <FilterBar filters={filters} setFilters={setFilters} />
      {userInfo?.role === 'admin' && (
        <Button
          mode="contained"
          style={styles.createButton}
          labelStyle={styles.createButtonLabel}
          icon="plus"
        >
          Crear nuevo curso
        </Button>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: THEME.colors.primary,
    alignSelf: 'flex-end',
    margin: 16,
  },
  createButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
});
