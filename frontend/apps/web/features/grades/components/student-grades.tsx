import { StudentGradesCard } from '@alum-net/courses';
import { useState } from 'react';
import { Card, IconButton } from 'react-native-paper';

export const StudentGrades = ({
  courseId,
  userEmail,
}: {
  courseId: number;
  userEmail: string;
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card style={{ marginTop: 8 }}>
      <Card.Title
        title="Calificaciones"
        titleVariant="headlineSmall"
        right={props => (
          <IconButton
            {...props}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={() => setExpanded(!expanded)}
          />
        )}
      />
      {expanded && (
        <StudentGradesCard courseId={courseId} userEmail={userEmail} />
      )}
    </Card>
  );
};
