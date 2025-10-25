import { useMemo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { SHIFTS } from '../constants';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Checkbox, Menu } from 'react-native-paper';
import { CourseShift, FiltersDirectory } from '../types';
import { useUserInfo } from '@alum-net/users';
import { THEME, FormTextInput } from '@alum-net/ui';
import { UserRole } from '@alum-net/users/src/types';
import { z } from 'zod';
import { useCoursesContext } from '../course-context';

const currentYear = new Date().getFullYear();
const maxYear = currentYear + 2;

export const filterBarSchema = z.object({
  name: z.string().optional().or(z.literal('')),
  teacherEmail: z
    .email('Debe ser un email válido')
    .optional()
    .or(z.literal('')),
  year: z
    .string()
    .optional()
    .or(z.literal(''))
    .refine(
      val => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return !isNaN(num);
      },
      { message: 'Debe ser un número' },
    )
    .refine(
      val => {
        if (!val) return true;
        const num = parseInt(val, 10);
        return num >= 0 && num <= maxYear;
      },
      { message: `Debe estar entre 0 y ${maxYear}` },
    ),
  shift: z
    .enum(
      SHIFTS.map(s => s.value).filter(Boolean) as [
        CourseShift,
        ...CourseShift[],
      ],
    )
    .optional(),
  myCourses: z.boolean().optional(),
});

type FilterBarSchema = z.infer<typeof filterBarSchema>;

interface FilterBarProps {
  onApplyFilters?: () => void;
}

export const FilterBar = ({ onApplyFilters }: FilterBarProps) => {
  const { data } = useUserInfo();
  const [shiftMenuVisible, setShiftMenuVisible] = useState(false);
  const { setFilters, appliedFilters: initialFilters } = useCoursesContext();
  const [shiftType, setShift] = useState<CourseShift | undefined>(
    initialFilters?.shift || undefined,
  );
  const [myCourses, setMyCourses] = useState(
    initialFilters?.myCourses || false,
  );

  const { control, handleSubmit, reset } = useForm<FilterBarSchema>({
    defaultValues: {
      name: initialFilters?.name || '',
      teacherEmail: initialFilters?.teacherEmail || '',
      year: initialFilters?.year || '',
    },
    mode: 'onChange',
  });

  const handleYearChange = useCallback(
    (value: string, fieldOnChange: (...event: any[]) => void) => {
      const numValue = parseInt(value);
      if (value === '' || (numValue >= 0 && numValue <= maxYear)) {
        fieldOnChange(value);
      }
    },
    [],
  );

  const selectedShiftLabel = useMemo(
    () => SHIFTS.find(s => s.value === shiftType)?.label || 'Todos los turnos',
    [shiftType],
  );

  const changeFilters = useCallback(
    (values: FiltersDirectory) => {
      setFilters(values);
      onApplyFilters?.();
    },
    [setFilters, onApplyFilters],
  );

  const clearFilters = () => {
    reset();
    setFilters({});
    setMyCourses(false);
    setShift(undefined);
    onApplyFilters?.();
  };

  return (
    <View style={styles.filterBar}>
      <FormTextInput
        name="name"
        control={control}
        label="Nombre del curso"
        mode="outlined"
        style={styles.filterInput}
        outlineColor="#333333"
        activeOutlineColor={THEME.colors.secondary}
      />
      <FormTextInput
        name="teacherEmail"
        control={control}
        label="Email del profesor"
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
            key={shiftOption.value || ''}
            onPress={() => {
              setShift(shiftOption.value);
              setShiftMenuVisible(false);
            }}
            title={shiftOption.label}
            titleStyle={styles.menuItemTitle}
          />
        ))}
      </Menu>

      {data?.role !== UserRole.admin && (
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
          changeFilters({
            ...data,
            shift: shiftType,
            myCourses: myCourses,
          }),
        )}
      >
        Aplicar Filtros
      </Button>
      <Button mode="outlined" onPress={clearFilters}>
        Limpiar
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
