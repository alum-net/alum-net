import api, { PageableResponse } from '@alum-net/api';
import { AxiosResponse } from 'axios';
import { getKeyclaokUserInfo, logout } from '@alum-net/auth';
import { UserFilterDTO, UserInfo, UserRole } from './types';
import { storage, STORAGE_KEYS } from '@alum-net/storage';

export const getUserInfo = async () => {
  try {
    let jsonUser = storage.getString(STORAGE_KEYS.USER_INFO);
    const userObject = JSON.parse(jsonUser ?? '{}');
    if (Object.hasOwn(userObject, 'role')) return userObject as UserInfo;

    const userInfo = await getKeyclaokUserInfo();
    const { data }: AxiosResponse<PageableResponse<UserInfo>> = await api.get(
      '/users/',
      {
        params: {
          size: 1,
          email: userInfo.email,
        },
      },
    );
    if (data?.data?.[0] === undefined) throw new Error('El usuario no existe');

    jsonUser = JSON.stringify(data.data[0]);
    storage.set(STORAGE_KEYS.USER_INFO, jsonUser);

    return data?.data?.[0];
  } catch (error: any) {
    console.log(error);
    logout();
    throw new Error('Error interno, intente mas tarde');
  }
};

function buildQueryString(
  queryParams: Record<string, string | number | undefined | null>,
): string {
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
}): Promise<PageableResponse<UserInfo>> {
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

  const res = await api.get<PageableResponse<UserInfo>>(
    `users/?${queryString}`,
  );
  return res.data;
}
