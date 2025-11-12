import { Toast, THEME } from '@alum-net/ui';
import { deleteLabel, deleteResource } from '../features/library/service';
import {
  Label,
  LibraryContextProvider,
  LibraryDashboard,
  LibraryResource,
} from '@alum-net/library';
import { UserRole, useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { PageableResponse, QUERY_KEYS } from '@alum-net/api';
import { CreateLabelForm } from '../features/library/components/create-label-form';
import { FileUploadForm } from '../features/library/components/file-upload-form';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { getAxiosErrorMessage } from '../features/users/service';

export default function Library() {
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const [labelIdToDelete, setLabelIdToDelete] = useState<number | null>(null);

  const { mutate: deleteLabelMutation } = useMutation({
    mutationFn: (data: { id: number }) => deleteLabel(data.id),
    onSuccess: async (_, variables) => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryLabels],
        (oldLabels: Label[]) =>
          oldLabels?.filter(label => label.id !== variables.id),
      );
      Toast.success('Etiqueta eliminada correctamente.');
      setLabelIdToDelete(null);
    },
    onError: (error) => {
      const errorMessage = getAxiosErrorMessage(error);
      Toast.error(errorMessage);
    },
  });

  const handleDeleteLabel = ({ id }: { id: number }) => {
    setLabelIdToDelete(id);
  };
  const { mutate: deleteResourceMutation } = useMutation({
    mutationFn: (data: { id: number }) => deleteResource(data.id),
    onSuccess: async (_, variables) => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryResources],
        (oldResources: PageableResponse<LibraryResource>) => ({
          ...oldResources,
          data: oldResources?.data?.filter(
            resource => resource.id !== variables.id,
          ),
        }),
      );
      Toast.success('Recurso eliminado correctamente.');
    },
    onError: error => {
      console.log(error);
      Toast.error('Error inesperado eliminando el recurso.');
    },
  });

  return (
    <>
      <View style={{ paddingVertical: 10, paddingHorizontal: 20, gap: 20 }}>
        <LibraryContextProvider>
          <Text variant="headlineLarge">Bienvenido a la libreria!</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {userInfo?.role === UserRole.admin && <CreateLabelForm />}
            {userInfo?.role !== UserRole.student && <FileUploadForm />}
          </View>
          <Text variant="headlineSmall">
            Utiliza los filtros para obtener los recursos que buscas:
          </Text>
          <LibraryDashboard
            deleteLabel={
              userInfo?.role === UserRole.admin
                ? handleDeleteLabel
                : undefined
            }
            deleteResource={
              userInfo?.role !== UserRole.student
                ? deleteResourceMutation
                : undefined
            }
          />
        </LibraryContextProvider>
      </View>
      <Portal>
        <Dialog
          visible={labelIdToDelete !== null}
          onDismiss={() => {
            setLabelIdToDelete(null);
          }}
          style={styles.dialog}
        >
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text>¿Querés eliminar la etiqueta?</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              onPress={() => {
                setLabelIdToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              mode="contained-tonal"
              buttonColor={THEME.colors.error}
              textColor="#fff"
              onPress={() => {
                if (labelIdToDelete !== null) {
                  deleteLabelMutation({ id: labelIdToDelete });
                }
              }}
            >
              Eliminar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}

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
