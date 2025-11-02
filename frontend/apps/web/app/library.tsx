import { Toast } from '@alum-net/ui';
import { deleteLabel, deleteResource } from '../features/library/service';
import { Label, LibraryDashboard, LibraryResource } from '@alum-net/library';
import { UserRole, useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { QUERY_KEYS } from '@alum-net/api';
import { CreateLabelForm } from '@/features/library/components/create-label-form';

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
        (oldResources: LibraryResource[]) =>
          oldResources?.filter(label => label.id !== variables.id),
      );
      Toast.success('Recurso eliminado correctamente.');
    },
    onError: () => {
      Toast.error('Error inesperado eliminando el recurso.');
    },
  });

  return (
    <View style={{ paddingVertical: 10, paddingHorizontal: 20, gap: 20 }}>
      <Text variant="headlineLarge">Bienvenido a la libreria!</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        {userInfo?.role === UserRole.admin && <CreateLabelForm />}
        {userInfo?.role !== UserRole.student && (
          <Button mode="outlined">Subir nuevo recurso a la libreria</Button>
        )}
      </View>
      <Text variant="headlineSmall">
        Utiliza los filtros para obtener los recursos que buscas:
      </Text>
      <LibraryDashboard
        deleteLabel={
          userInfo?.role !== UserRole.student ? deleteLabelMutation : undefined
        }
        deleteResource={
          userInfo?.role !== UserRole.student
            ? deleteResourceMutation
            : undefined
        }
      />
    </View>
  );
}
