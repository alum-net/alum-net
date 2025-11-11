import { FormTextInput, THEME, Toast } from '@alum-net/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal } from 'react-native-paper';
import { z } from 'zod';
import { createLabel, modifyLabel } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { Label } from '@alum-net/library';
import { UpdateLabelRequest } from '../types';
import { FontAwesome } from '@expo/vector-icons';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

type FormSchema = z.infer<typeof schema>;

type CreateLabelFormProps = {
  labelToEdit?: Label;
};

export const CreateLabelForm = ({ labelToEdit }: CreateLabelFormProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: labelToEdit?.name ?? '' },
  });

  const { mutate: createLabelMutation, isPending: isCreating } = useMutation({
    mutationFn: (data: FormSchema) => createLabel(data.name),
    onSuccess: async (newLabel: Label) => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryLabels],
        (oldLabels?: Label[]) =>
          oldLabels ? [...oldLabels, newLabel] : [newLabel],
      );
      dismissModal();
      Toast.success('Etiqueta creada correctamente');
    },
    onError: (error: unknown) => {
      console.log(error);
      Toast.error('Error inesperado creando la etiqueta');
    },
  });

  const { mutate: modifyLabelMutation, isPending: isEditing } = useMutation({
    mutationFn: (data: UpdateLabelRequest) =>
      modifyLabel(labelToEdit!.id, data.name),
    onSuccess: async (_, variables: UpdateLabelRequest) => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryLabels],
        (oldLabels?: Label[]) =>
          oldLabels?.map(label =>
            label.id === labelToEdit!.id
              ? { ...label, name: variables.name }
              : label,
          ),
      );
      dismissModal();
      Toast.success('Etiqueta modificada correctamente');
    },
    onError: (error: unknown) => {
      console.log(error);
      Toast.error('Error inesperado modificando la etiqueta');
    },
  });

  const dismissModal = () => {
    setIsVisible(false);
    reset({ name: labelToEdit?.name ?? '' });
  };

  const onSubmit = (data: FormSchema) => {
    if (labelToEdit) {
      modifyLabelMutation(data);
    } else {
      createLabelMutation(data);
    }
  };

  return (
    <>
      {labelToEdit ? (
        <FontAwesome
          style={{ marginHorizontal: 5 }}
          onPress={() => setIsVisible(true)}
          name="edit"
        />
      ) : (
        <Button
          mode="outlined"
          onPress={() => setIsVisible(true)}
          style={{
            width: 'auto',
            padding: 0,
            alignSelf: 'center',
            alignItems: 'center',
          }}
        >
          Crear nueva etiqueta de contenido
        </Button>
      )}
      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={dismissModal}
          style={styles.dialog}
        >
          <Dialog.Title>
            {labelToEdit ? 'Editar' : 'Crear'} etiqueta
          </Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <FormTextInput
              name="name"
              control={control}
              label="Nombre de la etiqueta"
              mode="outlined"
              autoCapitalize="none"
              outlineColor="#333333"
              activeOutlineColor={THEME.colors.secondary}
            />
            {errors.name && (
              <HelperText type="error">{errors.name.message}</HelperText>
            )}
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={dismissModal}>Cancelar</Button>
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              loading={isCreating || isEditing}
              disabled={isCreating || isEditing}
            >
              {labelToEdit ? 'Editar' : 'Crear'}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

const styles = StyleSheet.create({
  dialog: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: 420,
    maxWidth: '90%',
    borderRadius: 12,
  },
  dialogContent: {
    paddingTop: 4,
  },
  dialogActions: {
    justifyContent: 'flex-end',
  },
});
