import api from '@alum-net/api';
import type { UserRole } from '@alum-net/users/src/types';
import type { BulkUserCreationResponse } from './types';

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

export async function createUser(form: CreateUserForm): Promise<BackendEnvelope> {
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

export function getAxiosErrorMessage(e: any): string {
  const msg =
    e?.response?.data?.message ||
    e?.response?.data?.errors?.[0] ||
    e?.message ||
    'Error inesperado';
  return String(msg);
}

export async function bulkCreateUsers(
  file: File,
  hasHeaders = true
): Promise<BackendEnvelope<BulkUserCreationResponse>> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<BackendEnvelope<BulkUserCreationResponse>>(
    `/users/bulk-creation?hasHeaders=${hasHeaders}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );

  return response.data;
}