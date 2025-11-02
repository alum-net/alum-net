import { useQuery } from '@tanstack/react-query';
import { FlatList, Linking, Platform, View } from 'react-native';
import { Button, Card, Chip, Divider, Text } from 'react-native-paper';
import { getResources } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { THEME } from '@alum-net/ui';
import { useLabels } from '../hooks/useLables';
export const LibraryDashboard = ({
  deleteLabel,
  deleteResource,
}: {
  deleteLabel?: ({ id }: { id: number }) => void;
  deleteResource?: ({ id }: { id: number }) => void;
}) => {
  const { data: labels } = useLabels();

  const { data: resources } = useQuery({
    queryFn: () => getResources(),
    queryKey: [QUERY_KEYS.getLibraryResources],
    retry: 0,
  });

  return (
    <FlatList
      numColumns={Platform.OS === 'web' ? 4 : 1}
      data={resources?.data}
      renderItem={({ item }) => (
        <Card mode="elevated" style={{ margin: 10, padding: 10 }}>
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
            key={item.id}
            onPress={() => Linking.openURL(item.url)}
          >
            📄 {item.title} - {item.extension}
          </Button>
          <Divider />
          <Text variant="labelMedium">Etiquetas: </Text>
          <View style={{ flexDirection: 'row', gap: 4, flexWrap: 'wrap' }}>
            {item.labels.map(label => (
              <Text variant="labelMedium" key={label.id + '-' + item.id}>
                {label.name} -
              </Text>
            ))}
          </View>
          <Divider />
          {deleteResource && (
            <Button
              mode="text"
              textColor={THEME.colors.error}
              onPress={() => deleteResource({ id: item.id })}
            >
              Eliminar
            </Button>
          )}
        </Card>
      )}
      keyExtractor={resource => resource.id.toString()}
      ListHeaderComponent={
        <View style={{ gap: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
          {!!labels?.length && labels.length > 0 && (
            <Text variant="titleLarge">Etiquetas</Text>
          )}
          {labels?.map(label => (
            <Chip
              mode="outlined"
              selected
              selectedColor={THEME.colors.secondary}
              onPress={() => console.log('selecciono ' + label.name)}
              key={label.id}
              closeIcon="delete"
              onClose={
                deleteLabel ? () => deleteLabel({ id: label.id }) : undefined
              }
            >
              {label.name}
            </Chip>
          ))}
        </View>
      }
      ListEmptyComponent={() => (
        <Text variant="titleMedium" style={{ color: THEME.colors.error }}>
          No hay archivos en la biblioteca aún
        </Text>
      )}
      // ListFooterComponent={}
    />
  );
};
