import React, { useMemo, useState } from 'react';
import { FlatList, Linking, ScrollView, View } from 'react-native';
import { Card, Text, SegmentedButtons, Appbar } from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';

import Screen from '../../components/screen';
import { Section, useCourse } from '@alum-net/courses';
import { THEME } from '@alum-net/ui';

export default function Course() {
  const { id, name } = useLocalSearchParams();
  const nav = useNavigation();
  const { data, isLoading } = useCourse(id.toString());

  const [expandedSectionTitle, setExpandedSectionTitle] = useState('General');
  const [expandedSection, setExpandedSection] = useState<Section>();
  const buttons = useMemo(() => {
    const array = [{ value: 'General', label: 'General' }];
    if (data?.data)
      array.concat(
        data?.data?.sections.data?.map(section => ({
          value: section.title,
          label: section.title,
        })),
      );
    return array;
  }, [data?.data]);

  if (isLoading || !data?.data) return <Text>Cargando...</Text>;

  return (
    <Screen edges={['top']} scrollable={false}>
      <View style={{ gap: 20 }}>
        <Appbar
          safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
          style={{ backgroundColor: THEME.colors.background }}
        >
          <Appbar.BackAction onPress={nav.goBack} />
          <Appbar.Content title={name} />
        </Appbar>
        <ScrollView horizontal style={{ paddingVertical: 10 }}>
          <SegmentedButtons
            value={expandedSectionTitle}
            onValueChange={selectedSectionTitle => {
              setExpandedSectionTitle(selectedSectionTitle);
              setExpandedSection(
                data?.data?.sections.data?.find(
                  section => section.title === selectedSectionTitle,
                ),
              );
            }}
            buttons={buttons}
            style={{ width: '100%' }}
          />
        </ScrollView>
      </View>

      <FlatList
        data={expandedSection?.sectionResources}
        keyExtractor={item => item.title}
        ListHeaderComponent={<Text>{expandedSection?.description}</Text>}
        renderItem={({ item }) => (
          <Card style={{ marginBottom: 8 }}>
            <Card.Content>
              <Text onPress={() => Linking.openURL(item.url)}>
                {item.title}
              </Text>
              <Text style={{ marginTop: 4 }}>
                📄 {item.title} ({item.extension})
              </Text>
            </Card.Content>
          </Card>
        )}
      />
    </Screen>
  );
}
