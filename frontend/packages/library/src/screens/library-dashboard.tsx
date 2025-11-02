import { useQuery } from '@tanstack/react-query';
import { FlatList, Linking, Platform, View } from 'react-native';
import { Button, Chip, Divider, Text } from 'react-native-paper';
import { getLabels, getResources } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { THEME } from '@alum-net/ui';
export const LibraryDashboard = ({
  deleteLabel,
  deleteResource,
}: {
  deleteLabel?: ({ id }: { id: number }) => void;
  deleteResource?: ({ id }: { id: number }) => void;
}) => {
  const { data: labels } = useQuery({
    queryFn: getLabels,
    queryKey: [QUERY_KEYS.getLibraryLabels],
    retry: 0,
  });

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
          <Text variant="labelLarge">
            📄 {item.name}.{item.extension}
          </Text>
          <Divider />
          <Text variant="labelMedium">Etiquetas</Text>
          {item.labels.map(label => (
            <Text variant="labelMedium" key={label.id + '-' + item.id}>
              {label.name}
            </Text>
          ))}
        </Button>
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
