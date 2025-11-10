import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  Card,
  Text,
  SegmentedButtons,
  Appbar,
  Divider,
} from 'react-native-paper';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ForumLinks } from '@alum-net/forums';
import Screen from '../../../components/screen';
import {
  Section,
  SectionContent,
  StudentGradesCard,
  useCourse,
} from '@alum-net/courses';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users';

export default function Course() {
  const { id, name } = useLocalSearchParams();
  const nav = useNavigation();
  const { data, isLoading } = useCourse(id.toString());
  const { data: userInfo } = useUserInfo();
  const [expandedSectionTitle, setExpandedSectionTitle] = useState(
    data?.data?.sections.data[0].title ?? '',
  );
  const [expandedSection, setExpandedSection] = useState<Section>();
  const [width, setWidth] = useState(0);
  const buttons = useMemo(() => {
    const array = [];
    if (data?.data?.sections.data)
      array.push(
        ...data.data.sections.data.map(section => ({
          value: section.title,
          label: section.title,
        })),
      );
    array.push({ value: 'grades', label: 'Calificaciones' });
    return array;
  }, [data?.data?.sections.data]);

  return (
    <Screen edges={['top']} scrollable={false}>
      {isLoading || !data?.data ? (
        <Text>Cargando...</Text>
      ) : (
        <View
          style={{ gap: 20 }}
          onLayout={event => setWidth(event.nativeEvent.layout.width)}
        >
          <Appbar
            safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
            style={{ backgroundColor: THEME.colors.background }}
          >
            <Appbar.BackAction onPress={nav.goBack} />
            <Appbar.Content title={name} />
          </Appbar>
          <ForumLinks courseId={id.toString()} />
          <ScrollView horizontal style={{ paddingVertical: 10 }}>
            <Divider />
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

          <ScrollView>
            {expandedSectionTitle === 'grades' && (
              <StudentGradesCard
                courseId={Number(id.toString())}
                userEmail={userInfo!.email}
                style={{ margin: 10 }}
              />
            )}
            {expandedSection && (
              <Card style={{ marginVertical: 8, marginHorizontal: 4 }}>
                <Card.Content>
                  <SectionContent item={expandedSection} htmlWidth={width} />
                </Card.Content>
              </Card>
            )}
          </ScrollView>
        </View>
      )}
    </Screen>
  );
}
