import { Platform } from 'react-native';
import { FilesToUpload, SectionData } from './types';
import { deleteFalsyKeys } from '@alum-net/courses/src/helpers';
import api from '@alum-net/api';

async function buildFormData(
  sectionData: SectionData,
  selectedFiles?: FilesToUpload[],
) {
  const formData = new FormData();
  formData.append(
    'section',
    new Blob([JSON.stringify(deleteFalsyKeys(sectionData))], {
      type: 'application/json',
    }),
  );

  if (selectedFiles) {
    for (const file of selectedFiles) {
      if (Platform.OS === 'web') {
        try {
          const response = await fetch(file.uri);
          if (!response.ok) {
            throw new Error(`Error al cargar el archivo ${file.name}`);
          }
          const blob = await response.blob();
          
          const MAX_SIZE = 10 * 1024 * 1024;
          if (blob.size > MAX_SIZE) {
            throw new Error(`El archivo '${file.name}' excede el tamaño máximo de 10 MB`);
          }
          
          formData.append('resources', blob, file.name);
        } catch (error) {
          throw new Error(
            error instanceof Error 
              ? error.message 
              : `Error al procesar el archivo ${file.name}`
          );
        }
      }
    }
  }
  return formData;
}

export const createSection = async ({
  courseId,
  sectionData,
  selectedFiles,
}: {
  courseId: string;
  sectionData: SectionData;
  selectedFiles?: FilesToUpload[];
}) => {
  const { data } = await api.post(
    `/sections/${courseId}`,
    await buildFormData(sectionData, selectedFiles),
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return data;
};

export const updateSection = async ({
  courseId,
  sectionId,
  sectionData,
  selectedFiles,
}: {
  courseId: string;
  sectionId: number;
  sectionData: SectionData;
  selectedFiles?: FilesToUpload[];
}) => {
  const { data } = await api.put(
    `/sections/${courseId}/${sectionId}`,
    await buildFormData(sectionData, selectedFiles),
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return data;
};
