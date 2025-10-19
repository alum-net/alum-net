import { FilterBar } from '@alum-net/courses';
import { FiltersDirectory } from '@alum-net/courses/src/types';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';
import { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button } from 'react-native-paper';

function CourseFilters({
  initialFilters,
  onApplyFilters,
}: {
  initialFilters: FiltersDirectory;
  onApplyFilters: (filters: FiltersDirectory) => void;
}) {
  const { userInfo } = useUserInfo();
  return (
    <View>
      <FilterBar
        initialFilters={initialFilters}
        onApplyFilters={onApplyFilters}
      />
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

export default memo(CourseFilters);

const styles = StyleSheet.create({
  createButton: {
    backgroundColor: THEME.colors.primary,
    alignSelf: 'flex-end',
    marginHorizontal: 16,
    marginBottom: 16,
  },
  createButtonLabel: {
    color: 'white',
    fontSize: 12,
  },
});
