import React, { useRef, useState } from 'react';
import { View, ScrollView, StyleSheet, Modal } from 'react-native';
import { Button, Checkbox, Text, Banner, HelperText } from 'react-native-paper';
import { Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bulkEnrollStudents, bulkUnenrollStudents } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { isAxiosError } from 'axios';

function ErrorBanner({
  errorMessage,
  errorItems,
}: {
  errorMessage: string;
  errorItems: string[];
}) {
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
                  <HelperText type="error" style={styles.errText}>
                    {e}
                  </HelperText>
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
}

type Props = {
  visible: boolean;
  onDismiss: () => void;
  courseId: string | number;
  mode?: 'enroll' | 'unenroll';
};

export default function BulkEnrollModal({
  visible,
  onDismiss,
  courseId,
  mode = 'enroll',
}: Props) {
  const [selectedFile, setSelectedFile] = useState<File>();
  const [hasHeaders, setHasHeaders] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorItems, setErrorItems] = useState<string[]>([]);

  const scrollRef = useRef<ScrollView>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const clearFileInput = () => {
    setSelectedFile(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const { mutate, isPending } = useMutation({
    mutationFn: ({ file, hasHeaders }: { file: File; hasHeaders: boolean }) =>
      mode === 'unenroll'
        ? bulkUnenrollStudents(courseId, file, hasHeaders)
        : bulkEnrollStudents(courseId, file, hasHeaders),

    onMutate: () => {
      setErrorMessage('');
      setErrorItems([]);
    },

    onSuccess: resp => {
      const { data: payload, message } = resp.data;

      const { failedRecords, errors } = payload ?? {
        failedRecords: 0,
        errors: [],
      };

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getCourseMembers, String(courseId)],
      });

      if (failedRecords > 0) {
        const actionWord =
          mode === 'unenroll' ? 'des-matriculación' : 'matriculación';
        const header =
          message ??
          (failedRecords === 1
            ? `1 ${actionWord} no pudo ser procesada:`
            : `${failedRecords} ${actionWord} no pudieron ser procesadas:`);

        setErrorMessage(header);
        setErrorItems(
          (errors ?? []).map((error: any) => {
            if (typeof error === 'string') return error;
            return `Error en linea ${error.lineNumber ?? 'na'}: ${error.reason ?? JSON.stringify(error)}`;
          }),
        );
        clearFileInput();
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: 0, animated: true }),
        );
        return;
      }

      const successDefault =
        mode === 'unenroll'
          ? 'Des-matriculación masiva completada exitosamente.'
          : 'Matriculación masiva completada exitosamente.';

      Toast.success(message ?? successDefault);
      setErrorMessage('');
      setErrorItems([]);
      clearFileInput();
      onDismiss();
    },
    onError: error => {
      if (isAxiosError(error)) {
        const dataLayer = error?.response?.data;
        const message =
          error?.response?.data?.message ?? 'Error al procesar el CSV.';
        const errors = dataLayer?.errors ?? [];

        setErrorMessage(message);
        setErrorItems(
          (errors ?? []).map((err: any) =>
            typeof err === 'string'
              ? err
              : `Error en linea ${err.lineNumber ?? 'na'}: ${err.reason ?? JSON.stringify(err)}`,
          ),
        );
        clearFileInput();
        requestAnimationFrame(() =>
          scrollRef.current?.scrollTo({ y: 0, animated: true }),
        );
      } else {
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

  if (!visible) return null;

  return (
    <Modal visible={visible} onDismiss={handleCancel}>
      <ScrollView ref={scrollRef} style={styles.modal}>
        <Text variant="headlineMedium" style={styles.title}>
          {mode === 'unenroll'
            ? 'Des-matriculación masiva de estudiantes (CSV)'
            : 'Matriculación masiva de estudiantes (CSV)'}
        </Text>

        <ErrorBanner errorMessage={errorMessage} errorItems={errorItems} />

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
            id="csv-enroll-input"
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
  title: { marginBottom: 20, fontWeight: 'bold' },
  uploadBox: {
    marginTop: 8,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },
  selectedFile: { marginTop: 8, fontSize: 12 },
  row: { flexDirection: 'row', alignItems: 'center', marginTop: 16, gap: 6 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    gap: 10,
  },
  button: { flex: 1 },
  errContainer: { width: '100%' },
  errList: { marginTop: 10 },
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
  errRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 6 },
  errBullet: { color: '#b3261e', fontSize: 16, lineHeight: 20, marginRight: 6 },
  errText: { color: '#b3261e', fontSize: 13, lineHeight: 18, flex: 1 },
  errId: { fontWeight: '700' },
});
