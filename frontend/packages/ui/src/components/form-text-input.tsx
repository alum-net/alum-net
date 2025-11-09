import { TextInput, TextInputProps } from 'react-native-paper';
import {
  useController,
  Control,
  RegisterOptions,
  FieldValues,
  Path,
} from 'react-hook-form';

type FormTextInputProps<T extends FieldValues> = Omit<
  TextInputProps,
  'value' | 'onChangeText' | 'onBlur'
> & {
  name: Path<T>;
  control: Control<T>;
  rules?: RegisterOptions<T>;
  customOnChange?: (
    value: string,
    fieldOnChange: (...event: unknown[]) => void,
  ) => void;
};

export function FormTextInput<T extends FieldValues>({
  name,
  customOnChange,
  control,
  rules,
  ...textInputProps
}: FormTextInputProps<T>) {
  const {
    field,
    fieldState: { invalid },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <TextInput
      {...textInputProps}
      ref={field.ref}
      value={field.value}
      onChangeText={
        customOnChange
          ? value => {
              customOnChange(value, field.onChange);
            }
          : field.onChange
      }
      onBlur={field.onBlur}
      error={invalid}
    />
  );
}
