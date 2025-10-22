import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SHIFTS } from '../constants';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Menu } from 'react-native-paper';
import { CourseShift, FiltersDirectory } from '../types';
import { useUserInfo } from '@alum-net/users';
import { THEME, FormTextInput } from '@alum-net/ui';
import { useCoursesFilters } from '../hooks/useCoursesFilters';

interface FilterFormData {
  courseName: string;
  teacherName: string;
  year: string;
}

interface FilterBarProps {
  currentPage: number;
  onApplyFilters?: (filters: FiltersDirectory) => void;
  initialFilters?: FiltersDirectory;
}

export const FilterBar = ({
  currentPage,
  onApplyFilters,
  initialFilters,
}: FilterBarProps) => {
  const { userInfo } = useUserInfo();
  const [shiftMenuVisible, setShiftMenuVisible] = useState(false);
  const maxYear = useMemo(() => new Date().getFullYear() + 2, []);

  const { control, handleSubmit } = useForm<FilterFormData>({
    defaultValues: {
      courseName: initialFilters?.courseName || '',
      teacherName: initialFilters?.teacherName || '',
      year: initialFilters?.year || '',
    },
    mode: 'onChange',
  });

  const [shift, setShift] = useState<CourseShift | 'all'>(
    initialFilters?.shift || 'all',
  );
  const [myCourses, setMyCourses] = useState(
    initialFilters?.myCourses || false,
  );
  const { setAppliedFilters } = useCoursesFilters(currentPage, !onApplyFilters);

  const handleYearChange = useCallback(
    (value: string, fieldOnChange: (...event: any[]) => void) => {
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 0 && numValue <= maxYear)) {
        fieldOnChange(value);
      }
    },
    [maxYear],
  );

  const selectedShiftLabel = useMemo(
    () => SHIFTS.find(s => s.value === shift)?.label || 'Todos los turnos',
    [shift],
  );

  const changeFilters = useCallback(
    (values: FiltersDirectory) => {
      setAppliedFilters(values);
    },
    [setAppliedFilters],
  );

  return (
    <View style={styles.filterBar}>
      <FormTextInput
        name="courseName"
        control={control}
        label="Nombre del curso"
        mode="outlined"
        style={styles.filterInput}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
      />
      <FormTextInput
        name="teacherName"
        control={control}
        label="Nombre del profesor"
        mode="outlined"
        style={styles.filterInput}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
      />
      <FormTextInput
        name="year"
        control={control}
        label="Año"
        mode="outlined"
        keyboardType="numeric"
        style={styles.filterInputYear}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
        placeholder={`0-${maxYear}`}
        customOnChange={handleYearChange}
        rules={{
          validate: {
            isNumber: (value: string) => {
              if (value === '') return true;
              const num = parseInt(value);
              return !isNaN(num) || 'Debe ser un número';
            },
            inRange: (value: string) => {
              if (value === '') return true;
              const num = parseInt(value);
              return (
                (num >= 0 && num <= maxYear) ||
                `Debe estar entre 0 y ${maxYear}`
              );
            },
          },
        }}
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
              setShift(shiftOption.value);
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
            status={myCourses ? 'checked' : 'unchecked'}
            onPress={() => setMyCourses(!myCourses)}
            color={THEME.colors.secondary}
          />
          <Text style={styles.checkboxLabel}>Solo mis cursos</Text>
        </View>
      )}
      <Button
        mode="contained"
        onPress={handleSubmit(data =>
          onApplyFilters
            ? onApplyFilters({
                ...data,
                shift: shift,
                myCourses: myCourses,
              })
            : changeFilters({ ...data, shift: shift, myCourses: myCourses }),
        )}
      >
        Aplicar Filtros
      </Button>
    </View>
  );
};

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
