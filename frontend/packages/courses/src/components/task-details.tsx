import React, { useMemo, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, ActivityIndicator, Card } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { PERMITTED_FILE_TYPES } from '../constants';
import { FilesToUpload, Event, Submission } from '../types';
import { ViewSubmissionButton } from './view-submission-button';
import { MAX_FILE_SIZE, UserInfo, UserRole } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { submitHomework } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { Toast } from '@alum-net/ui';
import { isAxiosError } from 'axios';

type TaskDetailsProps = {
  eventId: string;
  data?: Event;
  userInfo: UserInfo;
};

export const TaskDetails: React.FC<TaskDetailsProps> = ({
  eventId,
  data,
  userInfo,
}) => {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState<FilesToUpload | null>(null);

  const { mutate, isPending } = useMutation({
    mutationFn: submitHomework,
    onSuccess: async () => {
      await queryClient.setQueryData(
        [QUERY_KEYS.getEventDetails, eventId],
        (oldData: Event | undefined) => {
          if (!oldData) return oldData;
          return {
            ...oldData,
            studentsWithPendingSubmission:
              oldData.studentsWithPendingSubmission.filter(
                studentEmail => studentEmail !== userInfo?.email,
              ),
          } as Event;
        },
      );
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getEventDetails, eventId],
      });
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
        const file = res.assets[0];
        if (!(file.size && file.size > MAX_FILE_SIZE * Math.pow(1024, 2))) {
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
    if (!selectedFile || !userInfo?.email || !eventId) {
      Toast.error('No se ha seleccionado ningun archivo');
      return;
    }

    mutate({
      eventId,
      studentEmail: userInfo.email,
      homeworkFile: selectedFile,
    });
  };
  const canUploadFile = useMemo(
    () =>
      userInfo?.role === UserRole.student &&
      data &&
      new Date(data.endDate) > new Date(),
    [userInfo, data],
  );

  const hasToUploadHomework = data?.studentsWithPendingSubmission?.includes(
    userInfo.email,
  );

  const isTeacher = userInfo?.role === UserRole.teacher;
  const isStudent = userInfo?.role === UserRole.student;
  const submissions = data?.submissions || [];

  if (isTeacher) {
    return (
      <View style={styles.submissionsContainer}>
        <Text variant="titleLarge" style={styles.submissionsTitle}>
          Entregas de estudiantes
        </Text>
        {submissions.length === 0 ? (
          <Text style={styles.emptyText}>No hay entregas aún</Text>
        ) : (
          submissions.map((submission: Submission) => (
            <Card key={submission.studentEmail} style={styles.submissionCard} mode="outlined">
              <Card.Content style={styles.cardContent}>
                <View style={styles.studentInfo}>
                  <Text variant="titleMedium" style={styles.studentName}>
                    {submission.studentName} {submission.studentLastname}
                  </Text>
                  <Text variant="bodySmall" style={styles.studentEmail}>
                    {submission.studentEmail}
                  </Text>
                </View>
                <ViewSubmissionButton
                  submission={submission}
                  style={styles.downloadButton}
                />
              </Card.Content>
            </Card>
          ))
        )}
      </View>
    );
  }

  if (!isStudent) {
    return null;
  }

  return (
    <View style={styles.uploadBox}>
      {isPending ? (
        <ActivityIndicator />
      ) : hasToUploadHomework ? (
        canUploadFile ? (
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
        ) : (
          <Text style={{ color: 'red' }}>
            Perdiste la oportunidad de subir tu tarea
          </Text>
        )
      ) : (
        <Text style={{ color: 'green' }}>Tarea subida correctamente</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
  submissionsContainer: {
    marginTop: 24,
    padding: 16,
  },
  submissionsTitle: {
    marginBottom: 16,
    fontWeight: '600',
  },
  submissionCard: {
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  studentInfo: {
    flex: 1,
    marginRight: 16,
  },
  studentName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  studentEmail: {
    color: '#666',
  },
  downloadButton: {
    alignSelf: 'flex-end',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    marginTop: 16,
  },
});

export default TaskDetails;
