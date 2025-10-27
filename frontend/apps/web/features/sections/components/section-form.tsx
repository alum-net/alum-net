import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  ActivityIndicator,
  Button,
  HelperText,
  Text,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useEditorBridge,
  RichText,
  Toolbar,
  useEditorContent,
} from '@10play/tentap-editor';
import { FormTextInput, MARKDOWN_TOOLBAR_ITEMS, Toast } from '@alum-net/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { SortableFileItem } from './sortable-file-item';
import {
  schema,
  SectionCreationFormSchema,
} from '../validations/section-creation';
import { FilesToUpload, SectionData } from '../types';
import { createSection, updateSection } from '../service';
import { Section } from '@alum-net/courses';
import { MAX_FILE_SIZE, PERMITTED_FILE_TYPES } from '../constants';

interface SectionFormProps {
  onFinish: () => void;
  courseId: string;
  initialData?: Section;
}

export const SectionForm: React.FC<SectionFormProps> = ({
  onFinish,
  courseId,
  initialData,
}) => {
  const isEditMode = Boolean(initialData);
  const [isLoadingMutation, setIsLoadingMutation] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FilesToUpload[]>(
    initialData?.sectionResources
      ?.sort((a, b) => a.order - b.order)
      .map(res => ({
        name: `${res.name}.${res.extension}`,
        uri: res.url,
        id: res.id,
      })) ?? [],
  );
  const [eliminatedResourcesIds, setEliminatedResourcesIds] = useState<
    number[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<SectionCreationFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? '',
      description: initialData?.description ?? '',
      resourcesMetadata:
        initialData?.sectionResources.map(res => ({
          filename: res.name,
          order: res.order,
        })) ?? [],
    },
  });

  const queryClient = useQueryClient();

  const { mutate: createMutate } = useMutation({
    mutationFn: (data: {
      sectionData: SectionData;
      selectedFiles?: FilesToUpload[];
    }) => createSection({ courseId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] });
      Toast.success('Sección creada correctamente');
      onFinish();
    },
    onError: () => {
      Toast.error('Error creando la sección');
      setIsLoadingMutation(false);
    },
  });

  const { mutate: updateMutate } = useMutation({
    mutationFn: (data: {
      sectionData: SectionData;
      selectedFiles?: FilesToUpload[];
    }) =>
      updateSection({
        courseId: courseId,
        sectionId: initialData!.id,
        ...data,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] });
      Toast.success('Sección modificada correctamente');
      onFinish();
    },
    onError: () => {
      Toast.error('Error modificando la sección');
      setIsLoadingMutation(false);
    },
  });

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
    initialContent: initialData?.description || '',
  });
  const editorContent = useEditorContent(editor, {
    type: 'html',
  });
  const sensors = useSensors(useSensor(PointerSensor));

  console.log(getValues('resourcesMetadata'));

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    if (over !== null && active.id !== over.id) {
      const oldIndex = selectedFiles.findIndex(
        (f, i) => active.id === f.name + i,
      );
      const newIndex = selectedFiles.findIndex(
        (f, i) => over.id === f.name + i,
      );
      const reordered = arrayMove(selectedFiles, oldIndex, newIndex);
      setSelectedFiles(reordered);
      setValue(
        'resourcesMetadata',
        reordered.map((file, index) => ({
          filename: file.name,
          order: index,
        })),
      );
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const removed = prev[index];
      if (removed.id) {
        setEliminatedResourcesIds(ids => [...ids, removed.id!]);
      }
      const updated = prev.filter((_, i) => i !== index);
      setValue(
        'resourcesMetadata',
        updated.map((file, i) => ({
          filename: file.name,
          order: i,
        })),
      );
      return updated;
    });
  };

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: PERMITTED_FILE_TYPES,
      });

      if (res.assets && res.assets.length > 0) {
        const newFiles = res.assets
          .filter(f => f.size && f.size < MAX_FILE_SIZE * Math.pow(1024, 2))
          .map(f => ({
            uri: f.uri,
            name: f.name,
            type: f.mimeType || 'application/octet-stream',
          }));
        setSelectedFiles(prev => {
          const combined = [...prev, ...newFiles];
          const metadata = combined.map((file, index) => ({
            filename: file.name.replace(/\.[^/.]+$/, ''),
            order: index,
          }));
          setValue('resourcesMetadata', metadata);
          return combined;
        });
        if (newFiles.length < res.assets.length)
          Toast.info('Uno de los archivos seleccionados pesa más de 10 MB');
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const onSubmit = async (data: SectionCreationFormSchema) => {
    setIsLoadingMutation(true);
    try {
      const sectionData = {
        title: data.title,
        description: editorContent || '',
        resourcesMetadata: selectedFiles.map((file, index) => ({
          filename: file.name,
          order: index,
        })),
      };

      if (isEditMode && initialData) {
        updateMutate({
          sectionData: { ...sectionData, eliminatedResourcesIds },
          selectedFiles: selectedFiles.filter(file => !Boolean(file.id)),
        });
      } else {
        createMutate({ sectionData, selectedFiles });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isLoadingMutation ? (
        <ActivityIndicator />
      ) : (
        <ScrollView>
          <FormTextInput
            name="title"
            label="Título de la sección *"
            control={control}
            mode="outlined"
            style={styles.input}
          />
          {errors.title && (
            <HelperText type="error">{errors.title.message}</HelperText>
          )}

          <Text style={styles.label}>Contenido</Text>
          <View style={styles.editorContainer}>
            <Toolbar editor={editor} items={[...MARKDOWN_TOOLBAR_ITEMS]} />
            <RichText editor={editor} />
          </View>

          <Text style={styles.label}>Recursos multimedia</Text>

          <View style={styles.uploadBox}>
            <Button
              icon="cloud-upload"
              mode="outlined"
              onPress={handleFileSelect}
            >
              Seleccionar archivos
            </Button>
            <Text style={styles.fileHint}>
              PDF, PPTX, XLSX, MP4, JPG, PNG, DOCX, ZIP
            </Text>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={selectedFiles.map((f, i) => f.name + i)}
                strategy={verticalListSortingStrategy}
              >
                {selectedFiles.map((file, index) => (
                  <SortableFileItem
                    key={file.name + index}
                    file={file}
                    index={index}
                    onRemove={handleRemoveFile}
                  />
                ))}
              </SortableContext>
            </DndContext>
          </View>

          <View style={styles.actions}>
            <Button mode="text" onPress={onFinish}>
              Cancelar
            </Button>
            <Button mode="contained" onPress={handleSubmit(onSubmit)}>
              {isEditMode ? 'Guardar cambios' : 'Crear sección'}
            </Button>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },
  input: { marginBottom: 8 },
  label: { marginTop: 16, marginBottom: 4, fontWeight: '500' },
  editorContainer: {
    height: 200,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    overflow: 'hidden',
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
  fileHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#777',
  },
  actions: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
});
