import api, { PageableResponse } from '@alum-net/api';
import { Label, LibraryResource } from './types';

export const getResources = async (page = 0) => {
  const { data } = await api.get<PageableResponse<LibraryResource>>(
    '/library/resources',
    {
      params: { page },
    },
  );

  return data;
};

export const getLabels = async () => {
  const { data } = await api.get<PageableResponse<Label>>('/library/labels', {
    params: { size: 500 },
  });

  return data.data;
};
