import React, { useState } from 'react';
import { View } from 'react-native';
import { Button, Card, Text, IconButton } from 'react-native-paper';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';
import type { CourseContent, Section } from '@alum-net/courses';
import { useLocalSearchParams } from 'expo-router';

export default function Course() {
  const { id } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  // Mock fetcher (replace with your API call)
  const fetchCourse = async (): Promise<CourseContent> => {
    const res = await fetch(`/api/courses/${id}`);
    if (!res.ok) throw new Error('Failed to fetch');
    return res.json();
  };

  const deleteSection = async (title: string) => {
    await fetch(`/api/courses/${id}/sections/${encodeURIComponent(title)}`, {
      method: 'DELETE',
    });
  };

  const { data, isLoading } = useQuery({
    queryKey: ['course', id],
    queryFn: fetchCourse,
  });

  const mutation = useMutation({
    mutationFn: deleteSection,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['course', id] }),
  });

  if (isLoading || !data) return <Text>Cargando...</Text>;

  return (
    <View style={{ flex: 1, padding: 24, backgroundColor: '#f9fafb' }}>
      <Text
        variant="headlineMedium"
        style={{ fontWeight: 'bold', marginBottom: 16 }}
      >
        Introducción a la Psicología
      </Text>

      <Button
        mode="contained-tonal"
        icon="plus"
        onPress={() => {}}
        style={{ alignSelf: 'flex-start', marginBottom: 16 }}
      >
        Añadir evento
      </Button>

      {data.sections.content.map((section: Section, index: number) => (
        <Card key={index} style={{ marginBottom: 8 }}>
          <Card.Title
            title={section.title}
            right={props => (
              <View style={{ flexDirection: 'row' }}>
                <IconButton {...props} icon="pencil" onPress={() => {}} />
                <IconButton
                  {...props}
                  icon="delete"
                  iconColor="red"
                  onPress={() => mutation.mutate(section.title)}
                />
                <IconButton
                  {...props}
                  icon={expanded[section.title] ? 'chevron-up' : 'chevron-down'}
                  onPress={() =>
                    setExpanded(prev => ({
                      ...prev,
                      [section.title]: !prev[section.title],
                    }))
                  }
                />
              </View>
            )}
          />
          {expanded[section.title] && (
            <Card.Content>
              <Text>{section.description}</Text>
              {section.sectionResources.map((r, i) => (
                <Text key={i} style={{ marginTop: 4 }}>
                  📄 {r.title} ({r.extension})
                </Text>
              ))}
            </Card.Content>
          )}
        </Card>
      ))}

      <Card
        style={{
          marginTop: 8,
          backgroundColor: '#eaf3ff',
          borderStyle: 'dashed',
          borderWidth: 1,
          borderColor: '#90caf9',
        }}
        onPress={() => {}}
      >
        <Card.Content style={{ alignItems: 'center' }}>
          <Ionicons name="add-circle-outline" size={20} color="#1976d2" />
          <Text style={{ color: '#1976d2', marginTop: 4 }}>Crear sección</Text>
        </Card.Content>
      </Card>

      <Card style={{ marginTop: 16 }}>
        <Card.Title title={`Miembros (${data.totalEnrollments ?? 0})`} />
      </Card>
    </View>
  );
}
