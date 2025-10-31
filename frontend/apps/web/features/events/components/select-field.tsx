import React, { useMemo, useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Text } from 'react-native-paper';
import { Controller, Control, FieldValues, Path } from 'react-hook-form';
import { Ionicons } from '@expo/vector-icons';

type Option = { label: string; value: string };

type SelectFieldProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label: string;
  options: Option[];
  error?: boolean;
  helperText?: string;
  onChangeTransform?: (value: string) => any;
};

export default function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  error,
  helperText,
  onChangeTransform,
}: SelectFieldProps<T>) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  
  const labelValueMap = useMemo(
    () => new Map(options.map((option) => [option.value, option.label])), 
    [options]
  );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => {
        const displayLabel = labelValueMap.get(String(value)) ?? 'Seleccionar...';
        
        return (
          <View>
            <Menu
              visible={isMenuVisible}
              onDismiss={() => setIsMenuVisible(false)}
              contentStyle={styles.menuContent}
              anchor={
                <TouchableOpacity
                  style={[
                    styles.selectButton,
                    error && styles.selectButtonError
                  ]}
                  onPress={() => setIsMenuVisible(true)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.selectText}>{displayLabel}</Text>
                  <Ionicons 
                    name={isMenuVisible ? "chevron-up" : "chevron-down"} 
                    size={20} 
                    color="#666"
                  />
                </TouchableOpacity>
              }
            >
              {options.map((option) => (
                <Menu.Item
                  key={option.value}
                  onPress={() => {
                    setIsMenuVisible(false);
                    const transformedValue = onChangeTransform 
                      ? onChangeTransform(option.value) 
                      : option.value;
                    onChange(transformedValue);
                  }}
                  title={option.label}
                  titleStyle={styles.menuItemTitle}
                />
              ))}
            </Menu>
            {error && !!helperText && (
              <Text style={styles.errorText}>{helperText}</Text>
            )}
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  selectButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 24,
    minHeight: 44,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectButtonError: {
    borderColor: '#d32f2f',
  },
  selectText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  menuContent: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginTop: 4,
  },
  menuItemTitle: {
    fontSize: 14,
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 16,
  },
});