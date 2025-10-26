import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Button, HelperText, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DocumentPicker from 'expo-document-picker';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { FormTextInput, MARKDOWN_TOOLBAR_ITEMS, Toast } from '@alum-net/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SectionCreationFormSchema,
  schema,
} from '../validations/section-creation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createSection } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { SortableFileItem } from './sortable-file-item';
import { FileMetadata } from '../types';

interface CreateSectionFormProps {
  onFinish: () => void;
  courseId: string;
}

export const SectionCreationForm: React.FC<CreateSectionFormProps> = ({
  onFinish,
  courseId,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SectionCreationFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      description: '',
      resourcesMetadata: [],
    },
  });
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: (data: {
      sectionData: {
        title: string;
        description?: string;
        resourcesMetadata: FileMetadata[];
      };
      selectedFiles?: { uri: string; name: string; type: string }[];
    }) => createSection({ courseId, ...data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.getCourse] });
    },
    onError: error => {
      Toast.error('Error creando la sección');
      console.log(error);
    },
  });

  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = ({ active, over }: any) => {
    if (active.id !== over?.id) {
      setSelectedFiles(prev => {
        const oldIndex = prev.findIndex((f, i) => active.id === f.name + i);
        const newIndex = prev.findIndex((f, i) => over.id === f.name + i);
        const newFiles = arrayMove(prev, oldIndex, newIndex);

        const metadata = newFiles.map((file, index) => ({
          filename: file.name,
          order: index,
        }));
        setValue('resourcesMetadata', metadata);

        return newFiles;
      });
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => {
      const updated = prev.filter((_, idx) => idx !== index);
      const metadata = updated.map((file, i) => ({
        filename: file.name,
        order: i,
      }));
      setValue('resourcesMetadata', metadata);
      return updated;
    });
  };

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: [
          'application/pdf',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'video/mp4',
          'image/jpeg',
          'image/png',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/zip',
        ],
        copyToCacheDirectory: true,
      });

      if (res.assets && res.assets.length > 0) {
        const newFiles = res.assets.map(f => ({
          uri: f.uri,
          name: f.name,
          type: f.mimeType || 'application/octet-stream',
        }));

        setSelectedFiles(prev => {
          const combined = [...prev, ...newFiles];
          // Update form value for metadata based on order
          const metadata = combined.map((file, index) => ({
            filename: file.name,
            order: index,
          }));
          setValue('resourcesMetadata', metadata);
          return combined;
        });
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const onSubmit = async (data: SectionCreationFormSchema) => {
    const htmlDescription = await editor.getHTML();

    const sectionData = {
      title: data.title,
      description: htmlDescription || '',
      resourcesMetadata: selectedFiles.map((file, index) => ({
        filename: file.name,
        order: index,
      })),
    };

    mutate({ sectionData, selectedFiles }, { onSuccess: onFinish });
  };

  return (
    <SafeAreaView style={styles.container}>
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
        {errors.description && (
          <HelperText type="error">{errors.description.message}</HelperText>
        )}

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

          {/* Sortable file list */}
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
        {errors.resourcesMetadata && (
          <HelperText type="error">
            {errors.resourcesMetadata.message}
          </HelperText>
        )}

        <View style={styles.actions}>
          <Button mode="text" onPress={onFinish}>
            Cancelar
          </Button>
          <Button mode="contained" onPress={handleSubmit(onSubmit)}>
            Guardar
          </Button>
        </View>
      </ScrollView>
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
