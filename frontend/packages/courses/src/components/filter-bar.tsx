import {
  useMemo,
  useState,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { SHIFTS } from '../constants';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Menu, TextInput } from 'react-native-paper';
import { FiltersDirectory, CourseShift, FilterBarRef } from '../types';
import { useUserInfo } from '@alum-net/users';
import { THEME } from '@alum-net/ui';

interface FilterBarProps {
  initialFilters: FiltersDirectory;
  onApplyFilters: (filters: FiltersDirectory) => void;
}

export const FilterBar = forwardRef<FilterBarRef, FilterBarProps>(
  ({ initialFilters, onApplyFilters }, ref) => {
    const { userInfo } = useUserInfo();
    const [shiftMenuVisible, setShiftMenuVisible] = useState(false);
    const currentYear = useMemo(() => new Date().getFullYear(), []);
    const maxYear = useMemo(() => currentYear + 2, [currentYear]);

    const courseNameRef = useRef(initialFilters.courseName || '');
    const teacherNameRef = useRef(initialFilters.teacherName || '');
    const yearRef = useRef(initialFilters.year || '');
    const [shift, setShift] = useState<CourseShift | 'all'>(
      initialFilters.shift || 'all',
    );
    const [myCourses, setMyCourses] = useState(
      initialFilters.myCourses || false,
    );

    const handleYearChange = useCallback(
      (text: string) => {
        const numValue = parseInt(text);
        if (text === '' || (numValue >= 0 && numValue <= maxYear)) {
          yearRef.current = text;
        }
      },
      [maxYear],
    );

    const selectedShiftLabel =
      SHIFTS.find(s => s.value === shift)?.label || 'Todos los turnos';

    const getFilters = useCallback(() => {
      return {
        courseName: courseNameRef.current,
        teacherName: teacherNameRef.current,
        year: yearRef.current,
        shift: shift,
        myCourses: myCourses,
      };
    }, [shift, myCourses]);

    useImperativeHandle(ref, () => ({
      getFilters,
    }));

    const applyFilters = useCallback(() => {
      onApplyFilters(getFilters());
    }, [onApplyFilters, getFilters]);

    return (
      <View style={styles.filterBar}>
        <TextInput
          label="Nombre del curso"
          onChangeText={value => (courseNameRef.current = value)}
          mode="outlined"
          style={styles.filterInput}
          outlineColor="#333333"
          defaultValue={courseNameRef.current}
          activeOutlineColor={THEME.colors.secondary}
        />
        <TextInput
          label="Nombre del profesor"
          onChangeText={value => (teacherNameRef.current = value)}
          mode="outlined"
          style={styles.filterInput}
          outlineColor="#333333"
          activeOutlineColor={THEME.colors.secondary}
          defaultValue={teacherNameRef.current}
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
          defaultValue={yearRef.current}
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
              onPress={() => setShift(shiftOption.value)}
              title={shiftOption.label}
              titleStyle={styles.menuItemTitle}
            />
          ))}
        </Menu>

        {userInfo?.role !== 'admin' && (
          <View style={styles.checkboxContainer}>
            <Checkbox
              status={myCourses ? 'checked' : 'unchecked'}
              onPress={() => setMyCourses(!myCourses)}
              color={THEME.colors.secondary}
            />
            <Text style={styles.checkboxLabel}>Solo mis cursos</Text>
          </View>
        )}
        <Button mode="contained" onPress={applyFilters}>
          Aplicar Filtros
        </Button>
      </View>
    );
  },
);

FilterBar.displayName = 'FilterBar';

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 15,
  },
  filterInput: {
    flex: 1,
    minWidth: 180,
    maxHeight: Platform.OS === 'android' ? 60 : undefined,
  },
  filterInputYear: {
    width: 120,
    maxHeight: Platform.OS === 'android' ? 60 : undefined,
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
