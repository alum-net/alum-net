import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Text, ActivityIndicator } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { EventDTO, EventType } from '../types';
import { PERMITTED_FILE_TYPES } from '../constants';

interface EventDetailsProps {
  event: EventDTO;
  // TODO: Add mutation for submitting the task
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const EventDetails = ({ event }: EventDetailsProps) => {
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: false,
        type: PERMITTED_FILE_TYPES,
      });

      if (res.assets && res.assets.length > 0) {
        setSelectedFile(res.assets[0]);
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      // TODO: show error toast
      return;
    }
    setIsLoading(true);
    console.log('Submitting file:', selectedFile.name);
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      setSelectedFile(null);
    }, 2000);
  };

  const isTask = event.type === EventType.TASK;

  return (
    <Card style={styles.card}>
      <Card.Title
        title={`Tarea: ${event.title}`}
        titleVariant="headlineMedium"
        style={styles.cardTitle}
      />
      <Card.Content>
        <Text variant="bodyLarge" style={styles.description}>
          {event.description}
        </Text>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de inicio</Text>
          <Text variant="bodyLarge">{formatDate(event.startDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Fecha de fin</Text>
          <Text variant="bodyLarge">{formatDate(event.endDate)}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text variant="bodyLarge">Nota máxima</Text>
          <Text variant="bodyLarge">{event.maxGrade} puntos</Text>
        </View>

        {isTask && (
          <View style={styles.uploadBox}>
            {isLoading ? (
              <ActivityIndicator />
            ) : (
              <>
                <Button
                  icon="cloud-upload-outline"
                  mode="text"
                  onPress={handleFileSelect}
                  style={styles.uploadButton}
                >
                  Arrastra y suelta o haz clic para subir
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
                  disabled={!selectedFile || isLoading}
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
