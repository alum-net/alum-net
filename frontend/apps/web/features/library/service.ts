import api, { Response } from '@alum-net/api';
import { Label } from '@alum-net/library';
import { FormValues } from './validator';

export const createLabel = async (name: string) => {
  const { data } = await api.post<Response<Label>>('/library/labels', { name });

  return data.data;
};

export const deleteLabel = (id: number) => api.delete(`/library/labels/${id}`);

export const createResource = async (formData: FormValues) => {
  const metadata = {
    creatorEmail: formData.creatorEmail,
    title: formData.title,
    labelIds: formData.labelIds,
  };

  const data = new FormData();
  const response = await fetch(formData.file.uri);
  const blob = await response.blob();
  data.append('file', blob, formData.file.name);
  data.append(
    'metadata',
    new Blob([JSON.stringify(metadata)], {
      type: 'application/json',
    }),
  );
  return await api.post('/library/resources', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const deleteResource = (id: number) =>
  api.delete(`/library/resources/${id}`);
