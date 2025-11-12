import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { Button, Text, ActivityIndicator } from 'react-native-paper';
import { useGrades } from '../hooks/useGrades';
import { StudentGrade, UnratedEvent } from '../types';
import GradesTable from '../components/grades-table';
import { Toast } from '@alum-net/ui';
import { validateAllGrades } from '../validations';
import { mapEventTypeToString, EventType } from '@alum-net/courses';
import { getEventById } from '@alum-net/courses/src/service';
import { useQueryClient, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS, Response } from '@alum-net/api';

type Props = {
  courseId: string;
};

const EventGradingScreen = ({ courseId }: Props) => {
  const [selectedEvent, setSelectedEvent] = useState<UnratedEvent | null>(null);
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const queryClient = useQueryClient();
  const {
    unratedEvents,
    isLoadingUnratedEvents,
    eventStudents,
    saveGrades,
    isSavingGrades,
  } = useGrades(courseId, selectedEvent?.id);

  const isTask = selectedEvent?.type?.toUpperCase() === EventType.TASK;
  const { data: eventData, isLoading: isLoadingEvent } = useQuery({
    queryKey: [QUERY_KEYS.getEventDetails, selectedEvent?.id],
    queryFn: () => getEventById(selectedEvent!.id.toString()),
    enabled: !!selectedEvent && isTask,
  });

  useEffect(() => {
    if (eventStudents) {
      setGrades(eventStudents.data ?? []);
    }
  }, [eventStudents]);

  const handleSelectEvent = (event: UnratedEvent) => {
    setSelectedEvent(event);
  };

  const handleGradeChange = (email: string, grade: string) => {
    const newGrades = grades.map(student =>
      student.email === email
        ? { ...student, grade: parseInt(grade) }
        : student,
    );
    setGrades(newGrades);
  };

  const handleSaveChanges = () => {
    if (!validateAllGrades(grades)) {
      Toast.error(
        'Hay notas inválidas. Por favor, revise las notas ingresadas. Recuerde calificar a todos los estudiantes.',
      );
      return;
    }
    if (selectedEvent) {
      saveGrades(
        {
          students: grades,
          eventId: selectedEvent.id.toString(),
        },
        {
          onSuccess: () => {
            Toast.success('Notas guardadas correctamente');
            queryClient.setQueryData(
              [QUERY_KEYS.getUnratedEvents, courseId],
              (oldData: Response<UnratedEvent[]>) => ({
                ...oldData,
                data: oldData.data?.filter(
                  event => event.id !== selectedEvent.id,
                ),
              }),
            );
            setSelectedEvent(null);
          },
          onError: () => {
            Toast.error('Error al guardar las notas');
          },
        },
      );
    }
  };

  if (isLoadingUnratedEvents) {
    return <ActivityIndicator />;
  }

  if (selectedEvent) {
    return (
      <View>
        <Button onPress={() => setSelectedEvent(null)}>Cancelar</Button>
        <Text variant="headlineSmall">
          {mapEventTypeToString(selectedEvent.type)}: {selectedEvent.title}
        </Text>
        {eventStudents ? (
          <>
            <GradesTable
              students={grades}
              onGradeChange={handleGradeChange}
              maxGrade={selectedEvent.maxGrade}
              submissions={isTask ? eventData?.submissions : undefined}
              showSubmissionsColumn={isTask}
            />
            <Button
              mode="contained"
              onPress={handleSaveChanges}
              disabled={isSavingGrades}
              loading={isSavingGrades}
              style={{ marginTop: 10 }}
            >
              Guardar y publicar resultados
            </Button>
          </>
        ) : (
          <ActivityIndicator />
        )}
      </View>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {unratedEvents?.data && (
        <>
          <Text variant="headlineSmall">
            {unratedEvents.data.length > 0
              ? 'Eventos sin corregir'
              : 'No hay eventos sin corregir'}
          </Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 10, gap: 20 }}>
            {unratedEvents.data?.map(event => (
              <View key={event.id} style={{}}>
                <Text variant="bodyMedium">{event.title}</Text>
                <Button onPress={() => handleSelectEvent(event)}>
                  Corregir
                </Button>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );
};

export default EventGradingScreen;
