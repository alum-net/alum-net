import api, { Response } from '@alum-net/api';
import { Label } from '@alum-net/library';

export const createLabel = async (name: string) => {
  const { data } = await api.post<Response<Label>>('/library/labels', { name });

  return data.data;
};

export const deleteLabel = (id: number) => api.delete(`/library/labels/${id}`);

// TODO: IMPLEMENT THE USAGE
export const createResource = () => api.post('/library/resources');

export const deleteResource = (id: number) =>
  api.delete(`/library/resources/${id}`);
