import { Platform } from 'react-native';
import { FilesToUpload, SectionData } from '../sections/types';
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

  if (selectedFiles)
    for (const file of selectedFiles) {
      if (Platform.OS === 'web') {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('resources', blob, file.name);
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
