import { UserRole } from '@alum-net/users/src/types';
import React, { useState } from 'react';
import { View } from 'react-native';
import { Card, IconButton, Text } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

interface SectionCardProps {
  item: {
    title: string;
    description: string;
    sectionResources: { title: string; extension: string }[];
  };
  userRole?: UserRole;
}

const SectionCard: React.FC<SectionCardProps> = ({ item, userRole }) => {
  const [expanded, setExpanded] = useState(false);
  const isTeacher = userRole === UserRole.teacher;
  const [htmlWidth, setHtmlWidth] = useState(0);

  const toggleExpand = () => setExpanded(prev => !prev);

  return (
    <Card
      style={{ marginBottom: 8 }}
      onLayout={event => setHtmlWidth(event.nativeEvent.layout.width)}
    >
      <Card.Title
        title={item.title}
        right={props => (
          <View style={{ flexDirection: 'row' }}>
            {isTeacher && (
              <>
                <IconButton {...props} icon="pencil" onPress={() => {}} />
                <IconButton {...props} icon="delete" iconColor="red" />
              </>
            )}
            <IconButton
              {...props}
              icon={expanded ? 'chevron-up' : 'chevron-down'}
              onPress={toggleExpand}
            />
          </View>
        )}
      />
      {expanded && (
        <Card.Content>
          <RenderHtml
            contentWidth={htmlWidth}
            source={{ html: item.description }}
          />
          {item.sectionResources.map((r, i) => (
            <Text key={i} style={{ marginTop: 4 }}>
              📄 {r.title} ({r.extension})
            </Text>
          ))}
        </Card.Content>
      )}
    </Card>
  );
};

export default SectionCard;
