import { FilterBar } from '@alum-net/courses/src/components/filter-bar';
import { FiltersDirectory, FilterName } from '@alum-net/courses/src/types';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  Button,
  Divider,
  IconButton,
  Portal,
  Surface,
} from 'react-native-paper';
import { ScrollView } from 'react-native-reanimated/lib/typescript/Animated';

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
        onPress={() => setDisplayFilters(!displayFilters)}
      >
        Filtros
      </Button>
      <Portal>
        {displayFilters && (
          <Surface style={styles.modalContainer} elevation={5}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtros</Text>
              <IconButton icon="close" iconColor="#ffffff" size={24} />
            </View>
            <Divider style={styles.modalDivider} />
            <ScrollView style={styles.modalContent}>
              <FilterBar filters={filters} setFilters={setFilters} />
              <Button mode="contained" onPress={() => console.log('aplique')}>
                Aplicar Filtros
              </Button>
            </ScrollView>
          </Surface>
        )}
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: THEME.colors.black,
    margin: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalDivider: {
    backgroundColor: '#333333',
  },
  modalContent: {
    padding: 16,
  },
});
