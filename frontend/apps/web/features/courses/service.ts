import api from '@alum-net/api';
import { Platform } from 'react-native';

export const createSection = async ({
  courseId,
  sectionData,
  selectedFiles,
}: {
  courseId: string;
  sectionData: { title: string; description?: string };
  selectedFiles?: { uri: string; name: string; type: string }[];
}) => {
  const formData = new FormData();

  formData.append(
    'section',
    new Blob([JSON.stringify(sectionData)], { type: 'application/json' }),
  );

  if (selectedFiles)
    for (const file of selectedFiles) {
      if (Platform.OS === 'web') {
        const response = await fetch(file.uri);
        const blob = await response.blob();
        formData.append('resources', blob, file.name);
      }
    }
  const response = await api.post(`/sections/${courseId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};
