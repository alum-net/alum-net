import api, { PageableResponse } from '@alum-net/api';
import { Label, LibraryResource, LibraryResourceFilter } from './types';

export const getResources = async (
  page = 0,
  filters: LibraryResourceFilter = {},
) => {
  const { data } = await api.get<PageableResponse<LibraryResource>>(
    '/library/resources',
    {
      params: { page, ...filters },
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
