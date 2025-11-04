import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { EventType, FilesToUpload } from '../types';
import { PERMITTED_FILE_TYPES } from '../constants';
import { useLocalSearchParams } from 'expo-router';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getEventById, submitHomework } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { MAX_FILE_SIZE, UserRole, useUserInfo } from '@alum-net/users';
import { Toast } from '@alum-net/ui';
import { isAxiosError } from 'axios';

export const EventDetails = () => {
  const { id, type } = useLocalSearchParams<{ id: string; type: EventType }>();
  const { data: userInfo } = useUserInfo();

  const { data, isLoading: loadingData } = useQuery({
    queryKey: [QUERY_KEYS.getEventDetails, id],
    queryFn: () => getEventById(id),
  });

  const [selectedFile, setSelectedFile] = useState<FilesToUpload | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: submitHomework,
    onSuccess: async () => {
      Toast.success('Tarea enviada correctamente');
      setSelectedFile(null);
    },
    onError: (err: unknown) => {
      if (isAxiosError(err)) {
        Toast.error(err.response?.data.message || 'Error al enviar la tarea');
      } else {
        Toast.error('Error al enviar la tarea');
      }
      console.error(err);
    },
  });

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: PERMITTED_FILE_TYPES,
      });

      if (res.assets && res.assets.length > 0) {
        if (
          !(
            res.assets[0].size &&
            res.assets[0].size > MAX_FILE_SIZE * Math.pow(1024, 2)
          )
        ) {
          const file = res.assets[0];
          setSelectedFile({
            uri: file.uri,
            name: file.name,
            type: file.mimeType || 'application/octet-stream',
          });
        } else {
          Toast.error('El archivo pesa mas de 10MB');
        }
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile || !userInfo?.email || !id) {
      Toast.error('No se ha seleccionado ningun archivo');
      return;
    }

    mutate({
      eventId: id,
      studentEmail: userInfo.email,
      homeworkFile: selectedFile,
    });
  };

  const canUploadFile = useMemo(
    () =>
      type.toUpperCase() === EventType.TASK &&
      userInfo?.role === UserRole.student &&
      data &&
      new Date(data.endDate) > new Date(),
    [userInfo, data, type],
  );

  if (loadingData) return <ActivityIndicator />;

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Tarea: ${data?.title}`}
        titleVariant="headlineMedium"
        style={styles.cardTitle}
      />
      <Card.Content>
        <Text variant="bodyLarge" style={styles.description}>
          {data?.description}
        </Text>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de inicio</Text>
          <Text variant="bodyLarge">{data?.startDate.toString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de fin</Text>
          <Text variant="bodyLarge">{data?.endDate.toString()}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Nota máxima</Text>
          <Text variant="bodyLarge">{data?.maxGrade} puntos</Text>
        </View>

        {canUploadFile && (
          <View style={styles.uploadBox}>
            {isPending ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button
                  icon="cloud-upload-outline"
                  mode="text"
                  onPress={handleFileSelect}
                  style={styles.uploadButton}
                >
                  {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                </Button>
                <Text style={styles.fileHint}>
                  PDF, PPTX, XLSX, MP4, JPG, PNG, DOCX, ZIP
                </Text>
                {selectedFile && (
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit}
                  disabled={!selectedFile || isPending}
                  style={styles.submitButton}
                >
                  Subir archivo
                </Button>
              </>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 16,
  },
  cardTitle: {
    paddingBottom: 8,
  },
  description: {
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 16,
  },
  uploadBox: {
    marginTop: 24,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },
  uploadButton: {
    marginBottom: 8,
  },
  fileName: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: '500',
  },
  fileHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },
  submitButton: {
    marginTop: 16,
  },
});
