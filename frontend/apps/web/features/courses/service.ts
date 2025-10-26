import api from '@alum-net/api';
import { Platform } from 'react-native';
import { FileMetadata } from './types';
import { deleteFalsyKeys } from '@alum-net/courses/src/helpers';

export const createSection = async ({
  courseId,
  sectionData,
  selectedFiles,
}: {
  courseId: string;
  sectionData: {
    title: string;
    description?: string;
    resourcesMetadata?: FileMetadata[];
  };
  selectedFiles?: { uri: string; name: string; type: string }[];
}) => {
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
  const { data } = await api.post(`/sections/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return data;
};

export const deleteCourse = async (courseId: string, sectionId: number) => {
  return await api.delete(`/sections/${courseId}/${sectionId}`);
};
