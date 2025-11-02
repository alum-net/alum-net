import api, { PageableResponse, Response } from '@alum-net/api';
import { AxiosResponse } from 'axios';
import { getKeyclaokUserInfo, logout } from '@alum-net/auth';
import { UpdatePayload, UserFilterDTO, UserInfo, UserRole } from './types';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { deleteFalsyKeys } from '@alum-net/courses/src/helpers';
import { Platform } from 'react-native';

export const getUserInfo = async () => {
  try {
    const userObject = JSON.parse(
      storage.getString(STORAGE_KEYS.USER_INFO) ?? '{}',
    );
    if (Object.hasOwn(userObject, 'role')) return userObject as UserInfo;

    const userInfo = await getKeyclaokUserInfo();
    const { data }: AxiosResponse<Response<UserInfo>> = await api.get(
      `/users/${userInfo.email}`,
    );
    if (data.data === undefined) throw new Error('El usuario no existe');

    storage.set(STORAGE_KEYS.USER_INFO, JSON.stringify(data.data));

    return data.data;
  } catch (error: unknown) {
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

async function buildFormData(data: UpdatePayload) {
  const formData = new FormData();
  formData.append(
    'modifyRequest',
    Platform.OS === 'web'
      ? new Blob(
          [
            JSON.stringify(
              deleteFalsyKeys({ name: data.name, lastname: data.lastname }),
            ),
          ],
          { type: 'application/json' },
        )
      : ({
          string: JSON.stringify(
            deleteFalsyKeys({
              name: data.name,
              lastname: data.lastname,
            }),
          ),
          type: 'application/json',
        } as any),
  );
  if (data.avatar.uri && data.avatar.type && data.avatar.filename) {
    const response = await fetch(data.avatar.uri || '');
    formData.append(
      'userAvatar',
      Platform.OS === 'web'
        ? await response.blob()
        : ({
            name: data.avatar.filename,
            uri: data.avatar.uri,
            type: data.avatar.type,
          } as any),
      data.avatar.filename,
    );
  }
  return formData;
}

export const updateUser = async (userEmail: string, data: UpdatePayload) => {
  const { data: updatedUser } = await api.patch<Response<UserInfo>>(
    `users/${userEmail}`,
    await buildFormData(data),
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  storage.set(STORAGE_KEYS.USER_INFO, JSON.stringify(updatedUser.data));
  return updatedUser.data;
};
