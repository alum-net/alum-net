import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Checkbox, Text, Banner } from 'react-native-paper';
import { Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkCreateCourses } from '../service';
import type { BulkCreationResponse, BulkCreationError } from '../types';
import { useCoursesContext } from '@alum-net/courses';
import { QUERY_KEYS } from '@alum-net/api';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function BulkCourseUploadModal({ visible, onDismiss }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [hasHeaders, setHasHeaders] = useState(true);

  const [errorMessage, setErrorMessage] = useState<string>();
  const [errorItems, setErrorItems] = useState<BulkCreationError[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { appliedFilters, currentPage } = useCoursesContext();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file, hasHeaders }: { file: File; hasHeaders: boolean }) =>
      bulkCreateCourses(file, hasHeaders).then(res => res.data as BulkCreationResponse),

    onMutate: () => {
      setErrorMessage(undefined);
      setErrorItems([]);
    },

    onSuccess: (data: BulkCreationResponse & { message?: string }) => {
        const { successfulCreations, failedCreations, errors, message } = data;
      
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.getCourses, appliedFilters, currentPage],
        });
      
        if (failedCreations > 0) {
          Toast.info(message ?? `Carga finalizada: ${successfulCreations} OK, ${failedCreations} errores.`);
          setErrorMessage('Se encontraron errores al procesar el CSV:');
          setErrorItems(errors ?? []);
          requestAnimationFrame(() => {
            scrollRef.current?.scrollTo({ y: 0, animated: true });
          });
          return;
        }
      
        const responseMessage = message ?? 'Carga masiva completada exitosamente.';
        Toast.success(responseMessage);
      
        setErrorMessage(undefined);
        setErrorItems([]);
        setSelectedFile(undefined);
        onDismiss();
      },
      

    onError: (error: any) => {
      const dataLayer = error?.response?.data?.data;
      const message = error?.response?.data?.message ?? 'Error al procesar el CSV.';
      const errors: BulkCreationError[] = dataLayer?.errors ?? [];

      Toast.error(message);
      setErrorMessage(message);
      setErrorItems(Array.isArray(errors) ? errors : []);

      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: 0, animated: true });
      });
    },
  });

  const handleCancel = () => {
    setSelectedFile(undefined);
    setErrorMessage(undefined);
    setErrorItems([]);
    onDismiss();
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleSubmit = () => {
    if (selectedFile) {
      mutate({ file: selectedFile, hasHeaders });
    }
  };

  if (!visible) return null;

  const renderErrorBanner = () => {
    if (!errorMessage && errorItems.length === 0) return null;

    const MAX_ITEMS = 6;
    const shown = errorItems.slice(0, MAX_ITEMS);
    const remaining = errorItems.length - shown.length;

    return (
      <View style={{ marginBottom: 16 }}>
        <Banner visible icon="alert-circle" style={{ backgroundColor: '#fdecea', borderRadius: 8 }}>
          <View style={styles.errContainer}>
            <View>
              <Text style={styles.errTitle}>
                {errorMessage ?? 'Se detectaron errores:'}
              </Text>
            </View>

            <View style={styles.errList}>
              {shown.map((e) => {
                const key = `${e.lineNumber ?? 'na'}-${e.identifier ?? ''}-${e.reason}`;
                return (
                  <View key={key} style={styles.errRow}>
                    <Text style={styles.errBullet}>•</Text>
                    <Text style={styles.errText}>
                      {Number.isFinite(e.lineNumber as number) && (
                        <Text style={styles.errId}>Línea {e.lineNumber}: </Text>
                      )}
                      {e.identifier && <Text style={styles.errId}>{e.identifier}: </Text>}
                      {e.reason}
                    </Text>
                  </View>
                );
              })}

              {remaining > 0 && (
                <Text style={[styles.errText, { marginTop: 6 }]}>
                  +{remaining} errores adicionales. Revisá el CSV.
                </Text>
              )}
            </View>
          </View>
        </Banner>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      onDismiss={handleCancel}
    >
      <ScrollView ref={scrollRef} style={styles.modal}>
        <Text variant="headlineMedium" style={styles.title}>
          Carga masiva de cursos (CSV)
        </Text>

        {renderErrorBanner()}

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
            id="csv-input"
            type="file"
            accept=".csv,text/csv"
            onChange={e => setSelectedFile(e.target.files?.[0] ?? undefined)}
            style={{ display: 'none' }}
          />

          {selectedFile && (
            <Text style={styles.selectedFile}>Archivo seleccionado: {selectedFile.name}</Text>
          )}
        </View>

        <View style={styles.row}>
          <Checkbox
            status={hasHeaders ? 'checked' : 'unchecked'}
            onPress={() => setHasHeaders(v => !v)}
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
  
    errContainer: {
      width: '100%',
    },
  
    errList: {
      marginTop: 10,
    },
  
    errTitle: {
      color: '#7f1d1d',
      fontWeight: '700',
      fontSize: 14,
      lineHeight: 20,
    },
  
    errRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 6,
    },
  
    errBullet: {
      color: '#b3261e',
      fontSize: 16,
      lineHeight: 20,
      marginRight: 6,
    },
  
    errText: {
      color: '#b3261e',
      fontSize: 13,
      lineHeight: 18,
      flex: 1,
    },
  
    errId: {
      fontWeight: '700',
    },
  });
  