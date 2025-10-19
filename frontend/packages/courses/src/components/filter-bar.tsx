import { useMemo, useState } from 'react';
import { SHIFTS } from '../constants';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Menu, TextInput } from 'react-native-paper';
import { FiltersDirectory, FilterName } from '../types';
import { useUserInfo } from '@alum-net/users';
import { THEME } from '@alum-net/ui';

export const FilterBar = ({
  filters,
  setFilters,
}: {
  filters: FiltersDirectory;
  setFilters: (filterName: FilterName, value?: string | boolean) => void;
}) => {
  const { userInfo } = useUserInfo();
  const [shiftMenuVisible, setShiftMenuVisible] = useState(false);
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const maxYear = useMemo(() => currentYear + 2, [currentYear]);

  const handleYearChange = (text: string) => {
    const numValue = parseInt(text);
    if (text === '' || (numValue >= 0 && numValue <= maxYear)) {
      setFilters('year', text);
    }
  };

  const selectedShiftLabel =
    SHIFTS.find(s => s.value === filters.shift)?.label || 'Todos los turnos';

  return (
    <View style={styles.filterBar}>
      <TextInput
        label="Nombre del curso"
        onChangeText={value => setFilters('courseName', value)}
        mode="outlined"
        style={styles.filterInput}
        outlineColor="#333333"
        defaultValue=""
        activeOutlineColor={THEME.colors.secondary}
      />
      <TextInput
        label="Nombre del profesor"
        onChangeText={value => setFilters('teacherName', value)}
        mode="outlined"
        style={styles.filterInput}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
        defaultValue=""
      />
      <TextInput
        label="Año"
        onChangeText={handleYearChange}
        mode="outlined"
        keyboardType="numeric"
        style={styles.filterInputYear}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
        placeholder={`0-${maxYear}`}
      />

      <Menu
        visible={shiftMenuVisible}
        onDismiss={() => setShiftMenuVisible(false)}
        anchor={
          <Button
            mode="outlined"
            onPress={() => setShiftMenuVisible(true)}
            style={styles.shiftButton}
            labelStyle={styles.shiftButtonLabel}
            icon="chevron-down"
            contentStyle={styles.shiftButtonContent}
          >
            {selectedShiftLabel}
          </Button>
        }
        contentStyle={styles.menuContent}
      >
        {SHIFTS.map(shiftOption => (
          <Menu.Item
            key={shiftOption.value}
            onPress={() => {
              setFilters('shift', shiftOption.value);
              setShiftMenuVisible(false);
            }}
            title={shiftOption.label}
            titleStyle={styles.menuItemTitle}
          />
        ))}
      </Menu>

      {userInfo?.role !== 'admin' && (
        <View style={styles.checkboxContainer}>
          <Checkbox
            status={filters.myCourses ? 'checked' : 'unchecked'}
            onPress={() => setFilters('myCourses', !filters.myCourses)}
            color={THEME.colors.secondary}
          />
          <Text style={styles.checkboxLabel}>Solo mis cursos</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterInput: {
    flex: 1,
    minWidth: 180,
  },
  filterInputYear: {
    width: 120,
  },
  shiftButton: {
    borderColor: '#333333',
    backgroundColor: THEME.colors.black,
    minWidth: 180,
  },
  shiftButtonLabel: {
    color: '#ffffff',
  },
  shiftButtonContent: {
    flexDirection: 'row-reverse',
  },
  menuContent: {
    backgroundColor: THEME.colors.black,
  },
  menuItemTitle: {
    color: '#ffffff',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
