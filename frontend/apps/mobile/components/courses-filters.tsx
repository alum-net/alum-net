import { FilterBar } from '@alum-net/courses/src/components/filter-bar';
import { FiltersDirectory, FilterName } from '@alum-net/courses/src/types';
import { useState } from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { Button, Divider, IconButton, Portal } from 'react-native-paper';

export default function CourseFilters({
  filters,
  setFilters,
}: {
  filters: FiltersDirectory;
  setFilters: (filterName: FilterName, value?: string | boolean) => void;
}) {
  const [displayFilters, setDisplayFilters] = useState(false);

  return (
    <>
      <Button
        mode="elevated"
        style={{ marginVertical: 10 }}
        onPress={() => setDisplayFilters(true)}
      >
        Filtros
      </Button>
      <Portal>
        <Modal
          onRequestClose={() => setDisplayFilters(false)}
          visible={displayFilters}
          backdropColor="#373737b5"
          animationType="fade"
        >
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
            <FilterBar filters={filters} setFilters={setFilters} />
            <Button
              mode="contained"
              onPress={() => {
                setDisplayFilters(false);
              }}
              style={{ marginTop: 20 }}
            >
              Aplicar Filtros
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

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
