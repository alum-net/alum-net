import React, { useState } from 'react';
import { FlatList, Modal, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { THEME } from '@alum-net/ui';
import { useCourse } from '@alum-net/courses';
import { useUserInfo } from '@alum-net/users';
import { SectionCreationForm } from '../../features/courses/components/section-creation-form';
import SectionCard from '../../features/courses/components/section-card';
import CourseMembersCard from './course-members-card';

export default function Course() {
  const { id, name } = useLocalSearchParams();
  const { data: userInfo } = useUserInfo();
  const { data, isLoading } = useCourse(id.toString());
  const [isCreateSectionModalVisible, setIsCreateSectionModalVisible] =
    useState(false);

  if (isLoading || !data) return <Text>Cargando...</Text>;

  return (
    <View
      style={{ flex: 1, padding: 24, backgroundColor: THEME.colors.background }}
    >
      <FlatList
        data={data.data?.sections.data}
        keyExtractor={item => item.title}
        style={{ width: '90%', alignSelf: 'center', padding: 10 }}
        ListHeaderComponent={
          <View style={{ gap: 20 }}>
            <Text variant="headlineMedium">{name}</Text>

            <Button
              mode="contained-tonal"
              icon="plus"
              onPress={() => {}}
              style={{ alignSelf: 'flex-start', marginBottom: 20 }}
            >
              Añadir evento
            </Button>
          </View>
        }
        renderItem={({ item }) => (
          <SectionCard item={item} userRole={userInfo?.role} />
        )}
        ListFooterComponent={
          <>
            <Card
              style={{
                marginTop: 8,
                backgroundColor: '#eaf3ff',
                borderStyle: 'dashed',
                borderWidth: 1,
                borderColor: '#90caf9',
              }}
              onPress={() => {
                setIsCreateSectionModalVisible(true);
              }}
            >
              <Card.Content style={{ alignItems: 'center' }}>
                <Ionicons name="add-circle-outline" size={20} color="#1976d2" />
                <Text style={{ color: '#1976d2', marginTop: 4 }}>
                  Crear sección
                </Text>
              </Card.Content>
            </Card>

            <CourseMembersCard
              courseId={id.toString()}
              totalEnrollments={data.data?.totalEnrollments ?? 0}
            />
          </>
        }
      />
      <Modal
        backdropColor={THEME.colors.backdrop}
        animationType="fade"
        visible={isCreateSectionModalVisible}
      >
        <SectionCreationForm
          onFinish={() => setIsCreateSectionModalVisible(false)}
          courseId={id.toString()}
        />
      </Modal>
    </View>
  );
}
