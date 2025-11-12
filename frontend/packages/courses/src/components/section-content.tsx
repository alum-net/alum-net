import { useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { EventType, Section } from '../types';
import { THEME, Toast } from '@alum-net/ui';
import { Linking, StyleSheet, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Link, useLocalSearchParams } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '../service';
import { UserRole, useUserInfo } from '@alum-net/users';
import { QUERY_KEYS } from '@alum-net/api';
import { isAxiosError } from 'axios';

export const mapEventTypeToString = (type: EventType) => {
  switch (type.toUpperCase()) {
    case EventType.TASK:
      return 'Tarea';
    case EventType.ONSITE:
      return 'Evento presencial';
    case EventType.QUESTIONNAIRE:
      return 'Questionario';
  }
};

export function SectionContent({
  item,
  htmlWidth,
}: {
  item: Section;
  htmlWidth: number;
}) {
  const { data: userInfo } = useUserInfo();
  const { id: courseId } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [eventIdToDelete, setEventIdToDelete] = useState<number | null>(null);
  
  const { mutate } = useMutation({
    mutationFn: (id: number) => deleteEvent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getCourse, courseId, userInfo?.email],
      });
      Toast.success('Evento eliminado correctamente');
      setConfirmVisible(false);
      setEventIdToDelete(null);
    },
    onError: error => {
      if (isAxiosError(error)) Toast.error(error.response?.data.message);
      else Toast.error('Error inesperado');
    },
  });

  const handleDeleteClick = (eventId: number) => {
    setEventIdToDelete(eventId);
    setConfirmVisible(true);
  };

  const handleConfirmDelete = () => {
    if (eventIdToDelete !== null) {
      mutate(eventIdToDelete);
    }
  };

  return (
    <>
      <RenderHtml
        contentWidth={htmlWidth}
        source={{ html: item.description }}
      />
      {item.sectionResources.length > 0 && (
        <Text variant="titleMedium">Recursos multimedia</Text>
      )}
      <View style={styles.childContainer}>
        {item.sectionResources
          .sort((a, b) => a.order - b.order)
          .map(r => (
            <Button
              elevation={5}
              contentStyle={{
                justifyContent: 'flex-start',
              }}
              buttonColor={THEME.colors.background}
              style={{
                marginVertical: 5,
                borderColor: THEME.colors.secondary,
                borderWidth: 1,
              }}
              mode="elevated"
              key={r.name + r.order}
              onPress={() => Linking.openURL(r.url)}
            >
              📄 {r.name}.{r.extension}
            </Button>
          ))}
      </View>
      {item.summaryEvents.length > 0 && (
        <Text variant="titleMedium">Eventos</Text>
      )}
      <View style={styles.childContainer}>
        {item.summaryEvents.map(event => (
          <View
            style={{ alignSelf: 'flex-start' }}
            key={event.title + event.type}
          >
            <Link
              href={{
                pathname: '/event/[id]',
                params: { id: event.id, type: event.type },
              }}
              asChild
            >
              <Button
                elevation={5}
                contentStyle={{
                  justifyContent: 'flex-start',
                }}
                buttonColor={THEME.colors.background}
                style={{
                  marginVertical: 5,
                  borderColor: THEME.colors.secondary,
                  borderWidth: 1,
                }}
                mode="elevated"
              >
                {mapEventTypeToString(event.type)} - {event.title}
              </Button>
            </Link>
            {userInfo?.role === UserRole.teacher && (
              <Button
                mode="text"
                textColor="red"
                onPress={() => handleDeleteClick(event.id)}
              >
                Eliminar
              </Button>
            )}
          </View>
        ))}
      </View>
      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={() => {
            setConfirmVisible(false);
            setEventIdToDelete(null);
          }}
          style={styles.dialog}
        >
          <Dialog.Title>Confirmar eliminación</Dialog.Title>
          <Dialog.Content style={styles.dialogContent}>
            <Text>¿Querés eliminar el evento?</Text>
          </Dialog.Content>
          <Dialog.Actions style={styles.dialogActions}>
            <Button
              onPress={() => {
                setConfirmVisible(false);
                setEventIdToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              mode="contained-tonal"
              buttonColor={THEME.colors.error}
              textColor="#fff"
              onPress={handleConfirmDelete}
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
  childContainer: { flexWrap: 'wrap', flexDirection: 'row', gap: 30 },
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
