import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getGrades } from '../service';
import { CourseGradesResponse, EventGradeDetailResponse } from '../types';
import { ActivityIndicator, Card, DataTable, Text } from 'react-native-paper';
import { QUERY_KEYS } from '@alum-net/api';

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
      <Card.Title title="Eventos" />
      <Card.Content>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Evento</DataTable.Title>
            <DataTable.Title numeric>Nota</DataTable.Title>
            <DataTable.Title numeric>Nota Máxima</DataTable.Title>
          </DataTable.Header>

          {grades?.eventGrades.map(
            (eventGrade: EventGradeDetailResponse, index: number) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{`Evento ${index + 1}`}</DataTable.Cell>
                <DataTable.Cell numeric>
                  {eventGrade.isUnrated ? 'No calificado' : eventGrade.grade}
                </DataTable.Cell>
                <DataTable.Cell numeric>{eventGrade.maxGrade}</DataTable.Cell>
              </DataTable.Row>
            ),
          )}
        </DataTable>
      </Card.Content>
      <Card.Title title="Nota final" />
      <Card.Content>
        {grades?.isUnrated ? (
          <Text>El curso aún no ha sido calificado.</Text>
        ) : (
          <>
            <Text>{`Nota final: ${grades?.finalGrade}`}</Text>
            <Text>{`Nota minima de exoneración: ${grades?.approvalGrade}`}</Text>
            <Text>
              {grades?.isApproved
                ? '¡Felicidades! Has aprobado el curso.'
                : 'No has aprobado el curso.'}
            </Text>
          </>
        )}
      </Card.Content>
    </Card>
  );
};
