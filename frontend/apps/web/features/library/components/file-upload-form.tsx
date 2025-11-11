import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import {
  Button,
  HelperText,
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTextInput, Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { PERMITTED_FILE_TYPES } from '../../courses/constants';
import { useLabels, LibraryResource } from '@alum-net/library';
import { FilesToUpload } from '../../courses/types';
import { createResource, modifyResource } from '../service';
import { FormValues, schema } from '../validator';
import { useUserInfo } from '@alum-net/users';
import { isAxiosError } from 'axios';
import { LibraryResourceUpdateRequest } from '../types';

type FileUploadFormProps = {
  resourceToEdit?: LibraryResource;
};

export const FileUploadForm = ({ resourceToEdit }: FileUploadFormProps) => {
  const [selectedFile, setSelectedFile] = useState<FilesToUpload>();
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const queryClient = useQueryClient();
  const { data: userInfo } = useUserInfo();
  const { data: labels, isLoading: loadingLabels } = useLabels();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      creatorEmail: '',
      title: resourceToEdit?.title ?? '',
      labelIds: resourceToEdit?.labels.map(l => l.id) ?? [],
      file: undefined,
    },
  });

  useEffect(() => {
    if (userInfo?.email) setValue('creatorEmail', userInfo.email);
  }, [userInfo, setValue]);

  const { mutate: createResourceMutation, isPending: isCreating } = useMutation(
    {
      mutationFn: createResource,
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.getLibraryResources],
        });
        Toast.success('Recurso creado correctamente');
        dismissModal();
      },
      onError: (err: unknown) => {
        setIsLoading(false);
        if (isAxiosError(err))
          setError('file.name', { message: err.response?.data.message });
        Toast.error('Error al crear el recurso');
        console.error(err);
      },
    },
  );

  const { mutate: modifyResourceMutation, isPending: isEditing } = useMutation({
    mutationFn: (data: LibraryResourceUpdateRequest) =>
      modifyResource(resourceToEdit!.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getLibraryResources],
      });
      dismissModal();
      Toast.success('Recurso modificado correctamente');
    },
    onError: (err: unknown) => {
      setIsLoading(false);
      if (isAxiosError(err))
        setError('root.serverError', { message: err.response?.data.message });
      Toast.error('Error al modificar el recurso');
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

        setSelectedFile({
          uri: file.uri,
          name: file.name,
          type: file.mimeType || 'application/octet-stream',
        });
        setValue('file', file);
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!data.creatorEmail) {
      Toast.error('No se pudo obtener el email del usuario.');
      return;
    }
    setIsLoading(true);
    if (resourceToEdit) {
      modifyResourceMutation({
        title: data.title,
        labelIds: data.labelIds,
        currentUserEmail: data.creatorEmail,
      });
    } else {
      createResourceMutation(data);
    }
  };

  const dismissModal = () => {
    setIsVisible(false);
    setIsLoading(false);
    setSelectedFile(undefined);
    reset({
      creatorEmail: userInfo?.email ?? '',
      title: resourceToEdit?.title ?? '',
      labelIds: resourceToEdit?.labels.map(l => l.id) ?? [],
      file: undefined,
    });
  };

  return (
    <>
      <Button
        mode={resourceToEdit ? 'text' : 'outlined'}
        onPress={() => setIsVisible(true)}
        icon={resourceToEdit ? 'pencil' : ''}
      >
        {resourceToEdit ? 'Editar' : 'Subir nuevo recurso a la libreria'}
      </Button>
      <Modal visible={isVisible} onDismiss={dismissModal}>
        <SafeAreaView style={styles.container}>
          {isLoading || isCreating || isEditing ? (
            <ActivityIndicator />
          ) : (
            <>
              <FormTextInput
                name="title"
                label="Título *"
                control={control}
                mode="outlined"
                style={styles.input}
              />
              {errors.title && (
                <HelperText type="error">{errors.title.message}</HelperText>
              )}

              <Text style={styles.label}>Etiquetas *</Text>
              {loadingLabels ? (
                <ActivityIndicator />
              ) : (
                <View style={styles.labelsContainer}>
                  {labels?.map(label => (
                    <Button
                      key={label.id}
                      mode={
                        watch('labelIds').includes(label.id)
                          ? 'contained'
                          : 'outlined'
                      }
                      onPress={() => {
                        const current = watch('labelIds');
                        const newSelection = current.includes(label.id)
                          ? current.filter(id => id !== label.id)
                          : [...current, label.id];
                        setValue('labelIds', newSelection);
                      }}
                      style={styles.labelButton}
                    >
                      {label.name}
                    </Button>
                  ))}
                </View>
              )}
              {errors.labelIds && (
                <HelperText type="error">{errors.labelIds.message}</HelperText>
              )}

              {errors.labelIds && (
                <HelperText type="error">{errors.labelIds.message}</HelperText>
              )}

              {!resourceToEdit && (
                <>
                  <Text style={styles.label}>Archivo *</Text>
                  <View style={styles.uploadBox}>
                    <Button
                      icon="cloud-upload"
                      mode="outlined"
                      onPress={handleFileSelect}
                    >
                      {selectedFile ? 'Cambiar archivo' : 'Seleccionar archivo'}
                    </Button>
                    {selectedFile && (
                      <Text style={styles.fileName}>{selectedFile.name}</Text>
                    )}
                    <Text style={styles.fileHint}>
                      PDF, PPTX, XLSX, MP4, JPG, PNG, DOCX, ZIP
                    </Text>
                  </View>
                  {errors.file && (
                    <HelperText type="error">
                      {errors.file.size?.message || errors.file.name?.message}
                    </HelperText>
                  )}
                </>
              )}

              {errors.root?.serverError && (
                <HelperText type="error">
                  {errors.root.serverError.message}
                </HelperText>
              )}

              <View style={styles.actions}>
                <Button mode="text" onPress={dismissModal}>
                  Cancelar
                </Button>
                <Button
                  mode="contained"
                  onPress={handleSubmit(onSubmit)}
                  loading={isCreating || isEditing}
                  disabled={isCreating || isEditing}
                >
                  {resourceToEdit ? 'Editar' : 'Crear'} recurso
                </Button>
              </View>
            </>
          )}
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 8 },
  label: { marginTop: 16, marginBottom: 4, fontWeight: '500' },
  uploadBox: {
    marginTop: 8,
    padding: 16,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    alignItems: 'center',
  },
  fileName: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  fileHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },
  labelsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  labelButton: {
    marginVertical: 4,
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
