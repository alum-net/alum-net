import api from '@alum-net/api';
import { AxiosResponse } from 'axios';
import { getKeyclaokUserInfo } from '@alum-net/auth';
import type {
  PageableResultResponse,
  UserFilterDTO,
  UserInfo,
  UserRole,
} from './types';

export const getUserInfo = async () => {
  const userInfo = await getKeyclaokUserInfo();

  const { data }: AxiosResponse<PageableResultResponse<UserInfo>> = await api.get(
    'users/',
    {
      params: {
        size: 1,
        email: userInfo.email,
      },
    },
  );

  return data?.data?.[0];
};


function buildQueryString(queryParams: Record<string, string | number | undefined | null>): string {
  const searchParams = new URLSearchParams();

  Object.entries(queryParams).forEach(([key, value]) => {
    if (value === '' || value === undefined || value === null) return;
    searchParams.append(key, String(value));
  });

  return searchParams.toString();
}

export async function fetchUsers(opts: {
  page: number;
  size: number;
  filter?: UserFilterDTO;
}): Promise<PageableResultResponse<UserInfo>> {
  const { page, size, filter } = opts;

  const normalizedRole = (filter?.role && String(filter.role).toUpperCase()) as
    | UserRole
    | ''
    | undefined;

  const queryString = buildQueryString({
    page,
    size,
    name: filter?.name,
    lastname: filter?.lastname,
    email: filter?.email,
    role: normalizedRole || undefined,
  });

  const res = await api.get<PageableResultResponse<UserInfo>>(`users/?${queryString}`);
  return res.data;
}
