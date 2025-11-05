export enum UserRole {
  admin = 'ADMIN',
  teacher = 'TEACHER',
  student = 'STUDENT',
}

export interface UserInfo {
  role: UserRole;
  avatarUrl?: string;
  email: string;
  enabled: boolean;
  lastname: string;
  name: string;
}

export type UserFilterDTO = {
  name?: string;
  lastname?: string;
  email?: string;
  role?: UserRole | '';
};

export type AvatarFile = {
  uri?: string;
  filename?: string;
  type?: string;
};

export type UpdatePayload = {
  avatar: AvatarFile;
  name: string;
  lastname: string;
};
