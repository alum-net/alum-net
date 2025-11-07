import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, ActivityIndicator } from 'react-native-paper';
import { EventType } from '../types';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getEventById } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { useUserInfo } from '@alum-net/users';
import { TaskDetails } from './task-details';
import { QuestionnaireDetails } from './questionnaire-details';

export const EventDetails = () => {
  const { id, type } = useLocalSearchParams<{ id: string; type: EventType }>();
  const { data: userInfo } = useUserInfo();
  const { data, isLoading: loadingData } = useQuery({
    queryKey: [QUERY_KEYS.getEventDetails, id],
    queryFn: () => getEventById(id),
  });

  if (loadingData) return <ActivityIndicator />;

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Tarea: ${data?.title}`}
        titleVariant="headlineMedium"
        style={styles.cardTitle}
      />
      <Card.Content>
        <Text variant="bodyLarge" style={styles.description}>
          {data?.description}
        </Text>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de inicio</Text>
          <Text variant="bodyLarge">{data?.startDate.toString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de fin</Text>
          <Text variant="bodyLarge">{data?.endDate.toString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Nota máxima</Text>
          <Text variant="bodyLarge">{data?.maxGrade} puntos</Text>
        </View>

        {type === EventType.TASK.toLowerCase() && (
          <TaskDetails eventId={id} data={data} userInfo={userInfo!} />
        )}

        {type === EventType.QUESTIONNAIRE.toLowerCase() && (
          <QuestionnaireDetails data={data} eventId={id} userInfo={userInfo} />
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  cardTitle: {
    paddingBottom: 8,
  },
  description: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
});

export default EventDetails;
