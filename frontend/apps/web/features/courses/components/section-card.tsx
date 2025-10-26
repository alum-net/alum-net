import { Section } from '@alum-net/courses';
import { THEME } from '@alum-net/ui';
import { UserRole } from '@alum-net/users/src/types';
import React, { useState } from 'react';
import { Linking, View } from 'react-native';
import { Button, Card, IconButton, Text } from 'react-native-paper';
import RenderHtml from 'react-native-render-html';

interface SectionCardProps {
  item: Section;
  userRole?: UserRole;
  deleteSection: (sectionId: number) => void;
}

const SectionCard: React.FC<SectionCardProps> = ({
  item,
  userRole,
  deleteSection,
}) => {
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
        titleVariant="headlineSmall"
        right={props => (
          <View style={{ flexDirection: 'row' }}>
            {isTeacher && (
              <>
                <IconButton {...props} icon="pencil" onPress={() => {}} />
                <IconButton
                  {...props}
                  icon="delete"
                  iconColor="red"
                  onPress={() => deleteSection(item.id)}
                />
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
          <Text variant="titleMedium">Recursos multimedia</Text>
          {item.sectionResources
            .sort((a, b) => a.order - b.order)
            .map((r, i) => (
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
        </Card.Content>
      )}
    </Card>
  );
};

export default SectionCard;
