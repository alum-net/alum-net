import { Button, Text } from 'react-native-paper';
import { EventType, Section } from '../types';
import { THEME, Toast } from '@alum-net/ui';
import { Linking, StyleSheet, View } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Link } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEvent } from '../service';
import { UserRole, useUserInfo } from '@alum-net/users';
import { QUERY_KEYS } from '@alum-net/api';
import { isAxiosError } from 'axios';

const mapEventTypeToString = (type: EventType) => {
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
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: ({ id }: { id: number }) => deleteEvent(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] });
      Toast.success('Evento eliminado correctamente');
    },
    onError: error => {
      if (isAxiosError(error)) Toast.error(error.response?.data.message);
      else Toast.error('Error inesperado');
    },
  });

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
                onPress={() => mutate({ id: event.id })}
              >
                Eliminar
              </Button>
            )}
          </View>
        ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  childContainer: { flexWrap: 'wrap', flexDirection: 'row', gap: 30 },
});
