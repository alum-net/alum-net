import { useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Platform, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { deleteCourse } from '../service';
import { Toast } from '@alum-net/ui';
import { PageableResponse, QUERY_KEYS } from '@alum-net/api';
import { CourseDisplay } from '../types';
import { UserRole } from '@alum-net/users/src/types';

export default function DeleteCourseButton({ courseId }: { courseId: string }) {
  const { data } = useUserInfo();
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: async () => await deleteCourse(courseId),
    onError: () => {
      Toast.error('Error al eliminar curso');
    },
    onSuccess: async () => {
      const oldData: PageableResponse<CourseDisplay> | undefined =
        await queryClient.getQueryData([QUERY_KEYS.getCourses]);
      await queryClient.setQueryData([QUERY_KEYS.getCourses], {
        ...oldData,
        data: oldData?.data?.filter(course => course?.id !== courseId),
      });
      Toast.success('Curso eliminado correctamente');
    },
  });

  if (Platform.OS !== 'web' || data?.role !== UserRole.admin) return null;

  return (
    <Button
      mode="text"
      style={styles.button}
      labelStyle={styles.buttonLabel}
      onPress={() => mutate()}
    >
      Eliminar
    </Button>
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
});
