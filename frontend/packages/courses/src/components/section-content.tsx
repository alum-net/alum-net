import { Button, Text } from 'react-native-paper';
import { Section } from '../types';
import { THEME } from '@alum-net/ui';
import { Linking } from 'react-native';
import RenderHtml from 'react-native-render-html';
import { Link } from 'expo-router';

export function SectionContent({
  item,
  htmlWidth,
}: {
  item: Section;
  htmlWidth: number;
}) {
  return (
    <>
      <RenderHtml
        contentWidth={htmlWidth}
        source={{ html: item.description }}
      />
      {item.sectionResources.length > 0 && (
        <Text variant="titleMedium">Recursos multimedia</Text>
      )}
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
      {item.summaryEvents.length > 0 && (
        <Text variant="titleMedium">Eventos</Text>
      )}
      {item.summaryEvents.map(event => (
        <Link
          href={{
            pathname: '/event/[id]',
            params: { id: event.id, type: event.type },
          }}
          key={event.title + event.type}
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
            {event.type} - {event.title}
          </Button>
        </Link>
      ))}
    </>
  );
}
