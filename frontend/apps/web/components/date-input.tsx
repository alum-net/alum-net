'use dom';
import { forwardRef } from 'react';
import {
  useController,
  Control,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form';
import { Text } from 'react-native-paper';

type DateInputProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  label: string;
  placeholder?: string;
  error?: boolean;
  style?: React.CSSProperties;
};

const DateInput = forwardRef<HTMLInputElement, DateInputProps>(
  ({ value, onChange, onBlur, label, placeholder, error, style }, ref) => {
    return (
      <div
        style={{
          marginBottom: '8px',
          ...style,
          flexDirection: 'column',
          display: 'flex',
        }}
      >
        <Text variant="labelLarge" style={{ marginBottom: 8, marginTop: 8 }}>
          {label}
        </Text>
        <input
          ref={ref}
          type="date"
          value={value}
          onChange={e => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          style={{
            padding: '12px',
            fontSize: '16px',
            border: error ? '2px solid #B00020' : '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#fff',
            outline: 'none',
            fontFamily: 'inherit',
          }}
        />
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

type FormDateInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  label: string;
  placeholder?: string;
  error?: boolean;
  style?: React.CSSProperties;
};

export default function FormDateInput<T extends FieldValues>(
  props: FormDateInputProps<T>,
) {
  const { name, control, rules, ...dateInputProps } = props;

  const { field } = useController({
    name,
    control,
    rules,
  });

  return (
    <DateInput
      {...dateInputProps}
      ref={field.ref}
      value={field.value}
      onChange={field.onChange}
      onBlur={field.onBlur}
    />
  );
}
