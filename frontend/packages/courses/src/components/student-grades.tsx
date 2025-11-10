import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGrades } from '../service';
import { CourseGradesResponse } from '../types';
import { ActivityIndicator, Card, DataTable, Text } from 'react-native-paper';
import { QUERY_KEYS } from '@alum-net/api';
import { mapEventTypeToString } from './section-content';

interface StudentGradesCardProps {
  courseId: number;
  userEmail: string;
}

export const StudentGradesCard = ({
  courseId,
  userEmail,
}: StudentGradesCardProps) => {
  const {
    data: grades,
    isLoading,
    isError,
  } = useQuery<CourseGradesResponse>({
    queryKey: [QUERY_KEYS.getStudentGrades, courseId, userEmail],
    queryFn: () => getGrades(courseId, userEmail),
  });

  if (isLoading) {
    return <ActivityIndicator animating={true} />;
  }

  if (isError) {
    return <Text>Error al cargar las notas.</Text>;
  }

  return (
    <Card>
      <Card.Content>
        <Card.Title title="Eventos" />
        <Card.Content>
          <DataTable>
            <DataTable.Header>
              <DataTable.Title>Evento</DataTable.Title>
              <DataTable.Title numeric>Nota</DataTable.Title>
              <DataTable.Title numeric>Nota Máxima</DataTable.Title>
            </DataTable.Header>
            {grades?.eventGrades.map((eventGrade, index: number) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{`${mapEventTypeToString(eventGrade.type)}: ${eventGrade.title}`}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {eventGrade.unrated ? 'No calificado' : eventGrade.grade}
                </DataTable.Cell>
                <DataTable.Cell numeric>{eventGrade.maxGrade}</DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        </Card.Content>
        <Card.Title title="Nota final" style={{ marginTop: 10 }} />
        <Card.Content>
          {grades?.unrated ? (
            <Text>El curso aún no ha sido calificado.</Text>
          ) : (
            <>
              <Text>{`Nota final: ${grades?.finalGrade}`}</Text>
              <Text>{`Nota minima de aprobación: ${grades?.approvalGrade}`}</Text>
              <Text>
                {grades?.approved
                  ? '¡Felicidades! Has aprobado el curso.'
                  : 'No has aprobado el curso.'}
              </Text>
            </>
          )}
        </Card.Content>
      </Card.Content>
    </Card>
  );
};
