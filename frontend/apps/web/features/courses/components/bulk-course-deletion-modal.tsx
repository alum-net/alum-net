import React, { useRef, useState, useMemo } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Checkbox, Text, Banner } from 'react-native-paper';
import { Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkDeleteCourses } from '../service';
import { useCoursesContext } from '@alum-net/courses';
import { QUERY_KEYS } from '@alum-net/api';
import { isAxiosError } from 'axios';

type Props = {
  visible: boolean;
  onDismiss: () => void;
};

export default function BulkCourseDeletionModal({ visible, onDismiss }: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [hasHeaders, setHasHeaders] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorItems, setErrorItems] = useState<string[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();
  const { appliedFilters, currentPage } = useCoursesContext();

  const clearFileInput = () => {
    setSelectedFile(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file, hasHeaders }: { file: File; hasHeaders: boolean }) =>
      bulkDeleteCourses(file, hasHeaders),

    onMutate: () => {
      setErrorMessage('');
      setErrorItems([]);
    },

    onSuccess: resp => {
      const { data: payload, message } = resp.data ?? {};

      const successfulRecords = payload?.successfulRecords ?? 0;
      const failedRecords = payload?.failedRecords ?? 0;
      const errors = payload?.errors ?? [];

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getCourses, appliedFilters, currentPage],
      });

      if (failedRecords > 0) {
        let successPart = '';
        if (successfulRecords === 1) {
          successPart = `✓ 1 curso eliminado correctamente.\n`;
        } else if (successfulRecords > 1) {
          successPart = `✓ ${successfulRecords} cursos eliminados correctamente.\n`;
        }

        const header =
          message ??
          (failedRecords === 1
            ? '1 curso no pudo ser eliminado:'
            : `${failedRecords} cursos no pudieron ser eliminados:`);

        setErrorMessage(`${successPart}${header}`);
        setErrorItems(
          (errors ?? []).map((err: any) =>
            typeof err === 'string'
              ? err
              : `Error en linea ${err.lineNumber ?? 'na'}: ${err.reason ?? JSON.stringify(err)}`,
          ),
        );
        clearFileInput();
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        });

        return;
      }

      Toast.success(
        message ?? 'Eliminación masiva de cursos completada exitosamente.',
      );

      setErrorMessage('');
      setErrorItems([]);
      clearFileInput();
      onDismiss();
    },

    onError: error => {
      if (isAxiosError(error)) {
        const dataLayer = error?.response?.data;
        const message = dataLayer?.message ?? 'Error al procesar el CSV.';
        const errors = dataLayer?.errors ?? [];

        Toast.error(message);
        setErrorMessage(message);
        setErrorItems(
          (errors ?? []).map((err: any) =>
            typeof err === 'string'
              ? err
              : `Error en linea ${err.lineNumber ?? 'na'}: ${err.reason ?? JSON.stringify(err)}`,
          ),
        );
        clearFileInput();
        requestAnimationFrame(() => {
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        });
      } else {
        Toast.error('Error inesperado');
        setErrorMessage('Error inesperado');
        setErrorItems([]);
        clearFileInput();
      }
    },
  });

  const handleCancel = () => {
    setErrorMessage('');
    setErrorItems([]);
    clearFileInput();
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
    const parts = errorMessage?.split('\n') ?? [];

    return (
      <View style={{ marginBottom: 16 }}>
        <Banner
          visible
          icon="alert-circle"
          style={{ backgroundColor: '#fdecea', borderRadius: 8 }}
        >
          <View style={styles.errContainer}>
            {parts.map((part, idx) =>
              part ? (
                <Text
                  key={idx}
                  style={[
                    part.includes('✓') ? styles.successTitle : styles.errTitle,
                    idx > 0 && { marginTop: 8 },
                  ]}
                >
                  {part}
                </Text>
              ) : null,
            )}

            <View style={styles.errList}>
              {shown.map(e => {
                const key =
                  e.length > 0 ? e.slice(0, 80) : Math.random().toString();
                return (
                  <View key={key} style={styles.errRow}>
                    <Text style={styles.errBullet}>•</Text>
                    <Text style={styles.errText}>{e}</Text>
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
  }, [errorMessage, errorItems]);

  if (!visible) return null;

  return (
    <Modal visible={visible} onDismiss={handleCancel}>
      <ScrollView ref={scrollRef} style={styles.modal}>
        <Text variant="headlineMedium" style={styles.title}>
          Eliminación masiva de cursos (CSV)
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
            id="csv-delete-input"
            type="file"
            accept=".csv,text/csv"
            onChange={e => setSelectedFile(e.target.files?.[0] ?? undefined)}
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
            Eliminar cursos
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

  successTitle: {
    color: '#065f46',
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
