import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, HelperText, Text, TextInput } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import * as DocumentPicker from 'expo-document-picker';
import { RichText, Toolbar, useEditorBridge } from '@10play/tentap-editor';
import { FormTextInput, MARKDOWN_TOOLBAR_ITEMS } from '@alum-net/ui';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  SectionCreationFormSchema,
  schema,
} from '../validations/section-creation';

interface CreateSectionFormProps {
  onFinish: () => void;
}

export const CreateSectionForm: React.FC<CreateSectionFormProps> = ({
  onFinish,
}) => {
  const [uploading, setUploading] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<
    { uri: string; name: string; type: string }[]
  >([]);
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    getValues,
  } = useForm<SectionCreationFormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      content: '',
      links: [],
      fileUrls: [],
    },
  });
  const editor = useEditorBridge({
    autofocus: false,
    avoidIosKeyboard: true,
  });

  const addLink = () => {
    if (linkInput.trim()) {
      try {
        // validate manually using zod to ensure it's a proper URL
        z.string().url().parse(linkInput);
        setValue('links', [...(getValues('links') || []), linkInput]);
        setLinkInput('');
      } catch {
        // invalid link format handled by UI or toast
      }
    }
  };

  const removeLink = (index: number) => {
    const currentLinks = getValues('links') || [];
    setValue(
      'links',
      currentLinks.filter((_, i) => i !== index),
    );
  };

  const handleFileSelect = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({ multiple: true });
      if (res.assets && res.assets.length > 0) {
        const newFiles = res.assets.map(f => ({
          uri: f.uri,
          name: f.name,
          type: f.mimeType || 'application/octet-stream',
        }));
        setSelectedFiles(prev => [...prev, ...newFiles]);
      }
    } catch (e) {
      console.error('File selection error:', e);
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = getValues('fileUrls') || [];
    setValue(
      'fileUrls',
      currentFiles.filter((_, i) => i !== index),
    );
  };

  const onSubmit = (data: SectionCreationFormSchema) => {
    console.log(data);
    onFinish();
  };

  return (
    <SafeAreaView style={styles.container}>
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
      <TextInput
        label="Añadir un enlace..."
        mode="outlined"
        value={linkInput}
        onChangeText={setLinkInput}
        right={<TextInput.Icon icon="plus" onPress={addLink} />}
      />
      <View style={{ marginTop: 8 }}>
        {(watch('links') || []).map((link, index) => (
          <View key={index} style={styles.linkItem}>
            <Text style={{ flex: 1 }}>{link}</Text>
            <Button compact onPress={() => removeLink(index)}>
              Eliminar
            </Button>
          </View>
        ))}
      </View>
      {errors.links && (
        <HelperText type="error">{errors.links.message}</HelperText>
      )}

      <View style={styles.uploadBox}>
        <Button icon="cloud-upload" mode="outlined" onPress={handleFileSelect}>
          Seleccionar archivos
        </Button>
        <Text style={styles.fileHint}>
          PDF, PPTX, XLSX, MP4, JPG, PNG, DOCX, ZIP
        </Text>

        {selectedFiles.map((f, i) => (
          <View key={i} style={styles.fileItem}>
            <Text style={{ flex: 1 }}>{f.name}</Text>
            <Button
              compact
              onPress={() =>
                setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))
              }
            >
              Eliminar
            </Button>
          </View>
        ))}
      </View>

      <View style={styles.actions}>
        <Button mode="text" onPress={onFinish}>
          Cancelar
        </Button>
        <Button mode="contained" onPress={handleSubmit(onSubmit)}>
          Guardar
        </Button>
      </View>
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
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginBottom: 4,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 6,
  },
});
