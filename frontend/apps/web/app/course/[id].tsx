import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { THEME, Toast } from '@alum-net/ui';
import { CourseContent, useCourse } from '@alum-net/courses';
import { useUserInfo } from '@alum-net/users';
import SectionCard from '../../features/courses/components/section-card';
import CourseMembersCard from './course-members-card';
import { UserRole } from '@alum-net/users/src/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCourse } from '../../features/courses/service';
import { QUERY_KEYS, Response } from '@alum-net/api';
import { SectionForm } from '../../features/courses/components/section-form';

export default function Course() {
  const { id, name } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const isTeacher = useMemo(
    () => userInfo?.role === UserRole.teacher,
    [userInfo?.role],
  );
  const { data, isLoading } = useCourse(id.toString());
  const { mutate } = useMutation({
    mutationFn: ({
      courseId,
      sectionId,
    }: {
      courseId: string;
      sectionId: number;
    }) => deleteCourse(courseId, sectionId),
    onSuccess: (_, variables) => {
      Toast.success('Sección eliminada correctamente');
      console.log(variables);
      queryClient.setQueryData(
        [QUERY_KEYS.getCourse],
        (oldData: Response<CourseContent>) => ({
          ...oldData,
          data: {
            ...oldData.data,
            sections: {
              ...oldData.data?.sections,
              data: oldData.data?.sections.data.filter(
                section => section.id !== variables.sectionId,
              ),
            },
          },
        }),
      );
    },
  });

  const [isSectionFormVisible, setIsSectionFormVisible] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingSectionId, setPendingSectionId] = useState<number>();

  const openSectionForm = (sectionId: number) => {
    setPendingSectionId(sectionId);
    setIsSectionFormVisible(true);
  };

  const openConfirm = (sectionId: number) => {
    setPendingSectionId(sectionId);
    setConfirmOpen(true);
  };

  const closeConfirm = () => {
    setConfirmOpen(false);
    setPendingSectionId(undefined);
  };

  const confirmUnenroll = async () => {
    if (!pendingSectionId) return;
    mutate({ courseId: id.toString(), sectionId: pendingSectionId });
    closeConfirm();
  };

  if (isLoading || !data) return <Text>Cargando...</Text>;

  return (
    <>
      <FlatList
        data={data.data?.sections.data}
        keyExtractor={item => item.title}
        style={{ width: '90%', alignSelf: 'center', padding: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <Text variant="headlineLarge">{name}</Text>
            <Text variant="titleMedium">{data.data?.description}</Text>
            {isTeacher && (
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => {}}
                style={{ alignSelf: 'flex-start', marginBottom: 20 }}
              >
                Añadir evento
              </Button>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <SectionCard
            item={item}
            userRole={userInfo?.role}
            deleteSection={openConfirm}
            modifySection={openSectionForm}
          />
        )}
        ListFooterComponent={
          <>
            {isTeacher && (
              <Card
                style={{
                  marginTop: 8,
                  backgroundColor: '#eaf3ff',
                  borderStyle: 'dashed',
                  borderWidth: 1,
                  borderColor: '#90caf9',
                }}
                onPress={() => {
                  setIsSectionFormVisible(true);
                }}
              >
                <Card.Content style={{ alignItems: 'center' }}>
                  <Ionicons
                    name="add-circle-outline"
                    size={20}
                    color="#1976d2"
                  />
                  <Text style={{ color: '#1976d2', marginTop: 4 }}>
                    Crear sección
                  </Text>
                </Card.Content>
              </Card>
            )}

            <CourseMembersCard
              courseId={id.toString()}
              totalEnrollments={data.data?.totalEnrollments ?? 0}
            />
          </>
        }
      />
      {confirmOpen && (
        <Portal>
          <Dialog visible onDismiss={closeConfirm} style={styles.dialog}>
            <Dialog.Title>Confirmar eliminación</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <Text>¿Querés eliminar la sección de este curso?</Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={closeConfirm}>Cancelar</Button>
              <Button
                mode="contained-tonal"
                buttonColor={THEME.colors.error}
                textColor="#fff"
                onPress={confirmUnenroll}
              >
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      <Modal
        backdropColor={THEME.colors.backdrop}
        animationType="fade"
        visible={isSectionFormVisible}
      >
        <SectionForm
          onFinish={() => {
            setIsSectionFormVisible(false);
            setPendingSectionId(undefined);
          }}
          courseId={id.toString()}
          initialData={
            pendingSectionId
              ? data.data?.sections.data.find(
                  section => section.id === pendingSectionId,
                )
              : undefined
          }
        />
      </Modal>
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
