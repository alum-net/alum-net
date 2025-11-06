import { FlatList, Linking, Platform, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  Divider,
  Text,
  TextInput,
} from 'react-native-paper';
import { THEME } from '@alum-net/ui';
import { useLabels } from '../hooks/useLables';
import { PropsWithChildren, ReactElement } from 'react';
import { useLibraryContext } from '../library-context';

const LibraryFilters = ({
  deleteLabel,
}: {
  deleteLabel: undefined | (({ id }: { id: number }) => void);
}) => {
  const { data: labels } = useLabels();
  console.log(labels);
  const { appliedFilters, setFilters, nameFilter, setNameFilter } =
    useLibraryContext();

  const toggleLabelFilter = (labelId: number) => {
    const currentLabelIds = appliedFilters?.labelIds || [];
    const newLabelIds = currentLabelIds.includes(labelId)
      ? currentLabelIds.filter(id => id !== labelId)
      : [...currentLabelIds, labelId];
    setFilters({ ...appliedFilters, labelIds: newLabelIds });
  };

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        label="Buscar por nombre"
        value={nameFilter}
        onChangeText={setNameFilter}
        style={{ marginBottom: 10 }}
      />
      <View style={{ gap: 5, flexDirection: 'row', flexWrap: 'wrap' }}>
        {!!labels?.length && labels.length > 0 && (
          <Text variant="titleLarge">Etiquetas</Text>
        )}
        {labels?.map(label => (
          <Chip
            mode="outlined"
            selected={appliedFilters?.labelIds?.includes(label.id)}
            selectedColor={THEME.colors.primary}
            onPress={() => toggleLabelFilter(label.id)}
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
    </View>
  );
};

export const LibraryDashboard = ({
  deleteLabel,
  deleteResource,
  filterContainer: FilterContainer,
}: {
  deleteLabel?: ({ id }: { id: number }) => void;
  deleteResource?: ({ id }: { id: number }) => void;
  filterContainer?: (props: PropsWithChildren) => ReactElement;
}) => {
  const {
    data: resources,
    currentPage,
    setPage,
    isLoading,
  } = useLibraryContext();

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
        <>
          {FilterContainer ? (
            <FilterContainer>
              <LibraryFilters deleteLabel={deleteLabel} />
            </FilterContainer>
          ) : (
            <LibraryFilters deleteLabel={deleteLabel} />
          )}
        </>
      }
      ListEmptyComponent={() =>
        isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text variant="titleMedium" style={{ color: THEME.colors.error }}>
            No hay archivos en la biblioteca aún
          </Text>
        )
      }
      ListFooterComponent={
        resources && resources.totalPages > 0 ? (
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginVertical: 16,
            }}
          >
            {resources.pageNumber > 0 && (
              <Button
                mode="contained-tonal"
                onPress={() => setPage(currentPage - 1)}
                buttonColor={THEME.colors.secondary}
                labelStyle={{
                  color: 'white',
                }}
              >
                Página anterior
              </Button>
            )}
            {resources.pageNumber < resources.totalPages - 1 && (
              <Button
                mode="contained-tonal"
                onPress={() => setPage(currentPage + 1)}
                buttonColor={THEME.colors.secondary}
                labelStyle={{
                  color: 'white',
                }}
              >
                Página siguiente
              </Button>
            )}
          </View>
        ) : null
      }
    />
  );
};
