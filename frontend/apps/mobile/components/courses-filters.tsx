import { FilterBar } from '@alum-net/courses/src/components/filter-bar';
import { FiltersDirectory, FilterBarRef } from '@alum-net/courses/src/types';
import { THEME } from '@alum-net/ui';
import { memo, useCallback, useRef, useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, IconButton, Portal } from 'react-native-paper';

function CourseFilters({
  initialFilters,
  onApplyFilters,
}: {
  initialFilters: FiltersDirectory;
  onApplyFilters: (filters: FiltersDirectory) => void;
}) {
  const [displayFilters, setDisplayFilters] = useState(false);
  const filterBarRef = useRef<FilterBarRef>(null);

  const applyFilters = useCallback(
    (filters: FiltersDirectory) => {
      setDisplayFilters(false);
      onApplyFilters(filters);
    },
    [onApplyFilters, setDisplayFilters],
  );

  return (
    <>
      <Button
        mode="elevated"
        style={{ marginVertical: 10 }}
        onPress={() => setDisplayFilters(true)}
      >
        Filtros
      </Button>
      <Modal
        onRequestClose={() => setDisplayFilters(false)}
        visible={displayFilters}
        backdropColor={THEME.colors.backdrop}
        animationType="fade"
      >
        <Portal.Host>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <IconButton
                icon="close"
                iconColor="black"
                size={24}
                onPress={() => setDisplayFilters(false)}
              />
            </View>
            <Divider style={styles.modalDivider} />
            <FilterBar
              ref={filterBarRef}
              initialFilters={initialFilters}
              onApplyFilters={applyFilters}
            />
          </View>
        </Portal.Host>
      </Modal>
    </>
  );
}

export default memo(CourseFilters);

const styles = StyleSheet.create({
  modalContainer: {
    padding: 20,
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDivider: {
    backgroundColor: '#333333',
  },
});
