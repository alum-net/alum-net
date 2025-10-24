import React, { useState } from 'react';
import { FlatList, Modal, View } from 'react-native';
import { Button, Card, Text, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { THEME } from '@alum-net/ui';
import { useCourse } from '@alum-net/courses';
import { useUserInfo } from '@alum-net/users';
import { UserRole } from '@alum-net/users/src/types';
import { CreateSectionForm } from '../../features/courses/components/section-creation';

export default function Course() {
  const { id, name } = useLocalSearchParams();
  const { data: userInfo } = useUserInfo();
  const { data, isLoading } = useCourse(id.toString());
  const [isCreateSectionModalVisible, setIsCreateSectionModalVisible] =
    useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({});

  if (isLoading || !data) return <Text>Cargando...</Text>;

  return (
    <View
      style={{ flex: 1, padding: 24, backgroundColor: THEME.colors.background }}
    >
      <FlatList
        data={data.data?.sections.content}
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
          <Card style={{ marginBottom: 8 }}>
            <Card.Title
              title={item.title}
              right={props => {
                if (userInfo?.role === UserRole.teacher)
                  return (
                    <View style={{ flexDirection: 'row' }}>
                      <IconButton {...props} icon="pencil" onPress={() => {}} />
                      <IconButton {...props} icon="delete" iconColor="red" />
                      <IconButton
                        {...props}
                        icon={
                          expandedSections[item.title]
                            ? 'chevron-up'
                            : 'chevron-down'
                        }
                        onPress={() =>
                          setExpandedSections(prev => ({
                            ...prev,
                            [item.title]: !prev[item.title],
                          }))
                        }
                      />
                    </View>
                  );
              }}
            />
            {expandedSections[item.title] && (
              <Card.Content>
                <Text>{item.description}</Text>
                {item.sectionResources.map((r, i) => (
                  <Text key={i} style={{ marginTop: 4 }}>
                    📄 {r.title} ({r.extension})
                  </Text>
                ))}
              </Card.Content>
            )}
          </Card>
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

            <Card style={{ marginTop: 16 }}>
              <Card.Title
                title={`Miembros (${data.data?.totalEnrollments ?? 0})`}
              />
            </Card>
          </>
        }
      />
      <Modal visible={isCreateSectionModalVisible}>
        <CreateSectionForm
          onFinish={() => setIsCreateSectionModalVisible(false)}
        />
      </Modal>
    </View>
  );
}
