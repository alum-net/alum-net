import { Toast } from '@alum-net/ui';
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
import { Text } from 'react-native-paper';
import { PageableResponse, QUERY_KEYS } from '@alum-net/api';
import { CreateLabelForm } from '../features/library/components/create-label-form';
import { FileUploadForm } from '../features/library/components/file-upload-form';

export default function Library() {
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();

  const { mutate: deleteLabelMutation } = useMutation({
    mutationFn: (data: { id: number }) => deleteLabel(data.id),
    onSuccess: async (_, variables) => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getLibraryLabels],
        (oldLabels: Label[]) =>
          oldLabels?.filter(label => label.id !== variables.id),
      );
      Toast.success('Etiqueta eliminada correctamente.');
    },
    onError: () => {
      Toast.error('Error inesperado eliminando la etiqueta.');
    },
  });
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
            userInfo?.role !== UserRole.student
              ? deleteLabelMutation
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
  );
}
