import { useState } from 'react';
import { useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Platform, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { deleteCourse } from '../service';
import { Toast, THEME } from '@alum-net/ui';
import { QUERY_KEYS } from '@alum-net/api';
import { UserRole } from '@alum-net/users/src/types';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const { data } = useUserInfo();
  const queryClient = useQueryClient();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const { mutate } = useMutation({
    mutationFn: async () => await deleteCourse(courseId),
    onError: () => {
      Toast.error('Error al eliminar curso');
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getCourses],
      });
      Toast.success('Curso eliminado correctamente');
    },
  });

  if (Platform.OS !== 'web' || data?.role !== UserRole.admin) return null;

  const handleDelete = () => {
    mutate();
    setConfirmVisible(false);
  };

  return (
    <>
      <Button
        mode="text"
        style={styles.button}
        labelStyle={styles.buttonLabel}
        onPress={() => setConfirmVisible(true)}
      >
        Eliminar
      </Button>
      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={() => setConfirmVisible(false)}
          style={styles.dialog}
        >
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text>¿Querés eliminar el curso?</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button onPress={() => setConfirmVisible(false)}>Cancelar</Button>
            <Button
              mode="contained-tonal"
              buttonColor={THEME.colors.error}
              textColor="#fff"
              onPress={handleDelete}
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
  button: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  buttonLabel: {
    fontSize: 12,
    color: '#9e0000ff',
  },
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
