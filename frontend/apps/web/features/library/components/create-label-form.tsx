import { FormTextInput, THEME, Toast } from '@alum-net/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet } from 'react-native';
import { Button, Dialog, HelperText, Portal } from 'react-native-paper';
import { z } from 'zod';
import { createLabel } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { Label } from '@alum-net/library';
import { getAxiosErrorMessage } from '../../users/service';

const schema = z.object({
  name: z.string().min(1, 'El nombre es requerido'),
});

type FormSchema = z.infer<typeof schema>;

export const CreateLabelForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: { name: '' },
  });

  const dismissModal = () => {
    setIsVisible(false);
    reset();
  };
  const onSubmit = async (data: FormSchema) => {
    try {
      const newLabel = await createLabel(data.name);
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryLabels],
        (oldLabels: Label[]) => [...oldLabels, newLabel],
      );
      reset();
      setIsVisible(false);
      Toast.success('Etiqueta creada correctamente');
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      Toast.error(errorMessage);
    }
  };

  return (
    <>
      <Button mode="outlined" onPress={() => setIsVisible(true)}>
        Crear nueva etiqueta de contenido
      </Button>
      <Portal>
        <Dialog
          visible={isVisible}
          onDismiss={dismissModal}
          style={styles.dialog}
        >
          <Dialog.Title>Crear etiqueta</Dialog.Title>

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
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
              Crear
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
