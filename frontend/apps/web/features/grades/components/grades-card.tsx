import React, { useState } from 'react';
import { Card, IconButton, SegmentedButtons } from 'react-native-paper';
import EventGradingScreen from '../screens/event-grading-screen';
import FinalGradesScreen from '../screens/final-grades-screen';

type Props = {
  courseId: string;
};

const GradesCard = ({ courseId }: Props) => {
  const [tab, setTab] = useState('events');
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <Card
      style={{
        marginTop: 8,
      }}
    >
      <Card.Title
        title="Calificaciones"
        titleVariant="headlineSmall"
        right={props => (
          <IconButton
            {...props}
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            onPress={toggleExpand}
          />
        )}
      />
      {expanded && (
        <Card.Content style={{ gap: 20 }}>
          <SegmentedButtons
            value={tab}
            onValueChange={setTab}
            theme={{}}
            buttons={[
              { value: 'events', label: 'Eventos' },
              { value: 'final', label: 'Calificaciones Finales' },
            ]}
          />
          {tab === 'events' ? (
            <EventGradingScreen courseId={courseId} />
          ) : (
            <FinalGradesScreen courseId={courseId} />
          )}
        </Card.Content>
      )}
    </Card>
  );
};

export default GradesCard;
