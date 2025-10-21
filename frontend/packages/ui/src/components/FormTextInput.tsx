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
};

export function FormTextInput<T extends FieldValues>(
  props: FormTextInputProps<T>,
) {
  const { name, control, rules, ...textInputProps } = props;

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
      onChangeText={field.onChange}
      onBlur={field.onBlur}
      error={invalid}
    />
  );
}
