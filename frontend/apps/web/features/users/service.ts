import api, { PageableResponse } from '@alum-net/api';
import type { UserRole } from '@alum-net/users/src/types';
import { UserActivityLog } from './types';

export type CreateUserForm = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
};

type BackendEnvelope<T = unknown> = {
  success: boolean;
  message: string;
  errors?: string[];
  statusCode?: number;
  data?: T;
};

const roleToGroup = (r: UserRole): 'students' | 'teachers' | 'admins' => {
  switch (r) {
    case 'ADMIN':
      return 'admins';
    case 'TEACHER':
      return 'teachers';
    case 'STUDENT':
      return 'students';
    default:
      return 'students';
  }
};

export async function createUser(
  form: CreateUserForm,
): Promise<BackendEnvelope> {
  const payload = {
    name: form.firstName,
    lastname: form.lastName,
    email: form.email,
    password: form.password,
    group: roleToGroup(form.role),
  };

  const res = await api.post<BackendEnvelope>('users/create-user', payload);
  return res.data;
}

export async function getUserActivity(
  userId: string,
  page?: number,
): Promise<PageableResponse<UserActivityLog>> {
  const { data } = await api.get<PageableResponse<UserActivityLog>>(
    `/users/${encodeURIComponent(userId)}/user-activity`,
    { 
      params: {
        ...(page !== undefined ? { page } : {}),
        sort: 'timestamp,desc'
      }
    },
  );

  return data;
}

export function getAxiosErrorMessage(e: any): string {
  const responseData = e?.response?.data;
  const msg =
    (responseData?.errors && Array.isArray(responseData.errors) && responseData.errors.length > 0 && responseData.errors[0]) ||
    responseData?.message ||
    e?.message ||
    'Error inesperado';
  return String(msg);
}
