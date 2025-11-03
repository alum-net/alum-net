import React, { useRef, useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Checkbox, Text, Banner } from 'react-native-paper';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import type { BulkUserCreationError } from '../types';
import { bulkCreateUsers } from '../users';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function BulkUserUploadModal({ visible, onDismiss }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [hasHeaders, setHasHeaders] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorItems, setErrorItems] = useState<BulkUserCreationError[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const clearFileInput = () => {
    setSelectedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file, hasHeaders }: { file: File; hasHeaders: boolean }) =>
      bulkCreateUsers(file, hasHeaders),

    onMutate: () => {
      setErrorMessage(undefined);
      setErrorItems([]);
    },

    onSuccess: (response) => {
      const { data } = response;
    
      if (!data) {
        setErrorMessage('Error al procesar la respuesta del servidor');
        return;
      }
    
      const { successfulCreations, failedCreations, errors } = data;
    
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getUsers] });
    
      if (failedCreations > 0) {

        let successMessage = '';
        if (successfulCreations === 1) {
          successMessage = `✓ 1 usuario creado correctamente.\n`;
        } else if (successfulCreations > 1) {
          successMessage = `✓ ${successfulCreations} usuarios creados correctamente.\n`;
        }
      
        const errorIntro =
          failedCreations === 1
            ? '1 usuario no pudo ser creado:'
            : `${failedCreations} usuarios no pudieron ser creados:`;
      
        setErrorMessage(successMessage + errorIntro);
        setErrorItems(errors ?? []);
        clearFileInput();
      
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        });
      
        return;
      }

      setErrorMessage(undefined);
      setErrorItems([]);
      setSelectedFile(undefined);
      onDismiss();
    },

    onError: (error: any) => {
      const dataLayer = error?.response?.data?.data;
      const message =
        error?.response?.data?.message ?? 'Error al procesar el CSV.';
      const errors: BulkUserCreationError[] = dataLayer?.errors ?? [];

      setErrorMessage(message);
      setErrorItems(Array.isArray(errors) ? errors : []);
      clearFileInput();
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
    },
  });

  const handleCancel = () => {
    clearFileInput();
    setErrorMessage(undefined);
    setErrorItems([]);
    onDismiss();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleSubmit = () => {
    if (!selectedFile) return;

    if (!selectedFile.name.endsWith('.csv')) {
      setErrorMessage('Solo se permiten archivos CSV');
      return;
    }

    mutate({ file: selectedFile, hasHeaders });
  };

  const errorBanner = useMemo(() => {
    if (!errorMessage && errorItems.length === 0) return null;

    const MAX_ITEMS = 6;
    const shown = errorItems.slice(0, MAX_ITEMS);
    const remaining = errorItems.length - shown.length;

    const hasSuccessMessage = errorMessage?.includes('✓');
    const messageParts = hasSuccessMessage
      ? errorMessage?.split('\n')
      : [errorMessage];

    return (
      <View style={{ marginBottom: 16 }}>
        <Banner
          visible
          icon="alert-circle"
          style={{ backgroundColor: '#fdecea', borderRadius: 8 }}
        >
          <View style={styles.errorContainer}>
            {messageParts?.map((part, index) => {
              if (!part) return null;

              const isSuccess = part.includes('✓');
              return (
                <Text
                  key={index}
                  style={[
                    isSuccess ? styles.successTitle : styles.errorTitle,
                    index > 0 && { marginTop: 8 },
                  ]}
                >
                  {part}
                </Text>
              );
            })}

            <View style={styles.errorList}>
              {shown.map((error) => {
                const key = `${error.lineNumber}-${error.identifier}-${error.reason}`;
                return (
                  <View key={key} style={styles.errorRow}>
                    <Text style={styles.errorBullet}>•</Text>
                    <Text style={styles.errorText}>
                      {Number.isFinite(error.lineNumber) && (
                        <Text style={styles.errorId}>
                          Línea {error.lineNumber}:{' '}
                        </Text>
                      )}
                      {error.identifier && (
                        <Text style={styles.errorId}>
                          {error.identifier}:{' '}
                        </Text>
                      )}
                      {error.reason}
                    </Text>
                  </View>
                );
              })}

              {remaining > 0 && (
                <Text style={[styles.errorText, { marginTop: 6 }]}>
                  +{remaining} errores adicionales. Revisá el CSV.
                </Text>
              )}
            </View>
          </View>
        </Banner>
      </View>
    );
  }, [errorMessage, errorItems]);

  if (!visible) return null;

  return (
    <Modal visible={visible} onDismiss={handleCancel}>
      <ScrollView ref={scrollRef} style={styles.modal}>
        <Text variant="headlineMedium" style={styles.title}>
          Carga masiva de usuarios (CSV)
        </Text>

        {errorBanner}

        <View style={styles.uploadBox}>
          <Button
            icon="cloud-upload"
            mode="outlined"
            onPress={handleUploadClick}
            disabled={isPending}
          >
            Seleccionar archivo CSV
          </Button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,text/csv"
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? undefined)}
            style={{ display: 'none' }}
          />

          {selectedFile && (
            <Text style={styles.selectedFile}>
              Archivo seleccionado: {selectedFile.name}
            </Text>
          )}
        </View>

        <View style={styles.row}>
          <Checkbox
            status={hasHeaders ? 'checked' : 'unchecked'}
            onPress={() => setHasHeaders((v) => !v)}
            disabled={isPending}
          />
          <Text>El CSV tiene cabecera</Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleCancel}
            style={styles.button}
            disabled={isPending}
          >
            Cancelar
          </Button>

          <Button
            mode="contained"
            onPress={handleSubmit}
            style={styles.button}
            disabled={!selectedFile || isPending}
            loading={isPending}
          >
            Subir CSV
          </Button>
        </View>
      </ScrollView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
    flex: 1,
    width: '60%',
    maxWidth: 880,
    alignSelf: 'center',
  },

  title: {
    marginBottom: 20,
    fontWeight: 'bold',
  },

  infoBox: {
    backgroundColor: '#f0f9ff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bfdbfe',
    marginBottom: 16,
  },

  infoTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 8,
    color: '#1e40af',
  },

  infoText: {
    fontSize: 13,
    color: '#1e3a8a',
    lineHeight: 20,
  },

  infoNote: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 8,
    fontStyle: 'italic',
  },

  uploadBox: {
    marginTop: 8,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },

  selectedFile: {
    marginTop: 8,
    fontSize: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    gap: 6,
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },

  button: {
    flex: 1,
  },

  errorContainer: {
    width: '100%',
  },

  errorList: {
    marginTop: 10,
  },

  successTitle: {
    color: '#065f46',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
  },

  errorTitle: {
    color: '#7f1d1d',
    fontWeight: '700',
    fontSize: 14,
    lineHeight: 20,
  },

  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },

  errorBullet: {
    color: '#b3261e',
    fontSize: 16,
    lineHeight: 20,
    marginRight: 6,
  },

  errorText: {
    color: '#b3261e',
    fontSize: 13,
    lineHeight: 18,
    flex: 1,
  },

  errorId: {
    fontWeight: '700',
  },
});