import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Card, Dialog, Portal, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { THEME, Toast } from '@alum-net/ui';
import { CourseContent, useCourse } from '@alum-net/courses';
import { useUserInfo } from '@alum-net/users';
import SectionCard from '../../../features/sections/components/section-card';
import CourseMembersCard from '../../../features/courses/components/course-members-card';
import { UserRole } from '@alum-net/users/src/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteCourse } from '../../../features/courses/service';
import { QUERY_KEYS, Response } from '@alum-net/api';
import { SectionForm } from '../../../features/sections/components/section-form';
import { ForumLinks } from '@alum-net/forums';
import RenderHTML from 'react-native-render-html';
import EventCreationModal from '../../../features/events/components/event-creation-modal';
import TeacherGradesCard from '../../../features/grades/components/teacher-grades-card';
import { StudentGrades } from '../../../features/grades/components/student-grades';

export default function Course() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
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
      queryClient.setQueryData(
        [QUERY_KEYS.getCourse, id.toString(), userInfo?.email],
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
  const [htmlWidth, setHtmlWidth] = useState(0);

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
        onLayout={event => setHtmlWidth(event.nativeEvent.layout.width)}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <Text variant="headlineLarge">{data?.data?.name}</Text>
            <RenderHTML
              source={{ html: data.data?.description || '' }}
              contentWidth={htmlWidth}
            />
            {isTeacher && (
              <Button
                mode="contained-tonal"
                icon="plus"
                onPress={() => setIsEventModalVisible(true)}
                style={{ alignSelf: 'flex-start', marginBottom: 20 }}
              >
                Añadir evento
              </Button>
            )}
            <ForumLinks courseId={id.toString()} />
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
            {(isTeacher || userInfo?.role === UserRole.admin) && (
              <CourseMembersCard courseId={id.toString()} />
            )}
            {isTeacher && <TeacherGradesCard courseId={id.toString()} />}
            {userInfo?.role === UserRole.student && (
              <StudentGrades
                courseId={Number(id.toString())}
                userEmail={userInfo.email}
              />
            )}
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
      <EventCreationModal
        visible={isEventModalVisible}
        onClose={() => setIsEventModalVisible(false)}
        courseId={id.toString()}
        sections={data.data?.sections.data ?? []}
      />
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
