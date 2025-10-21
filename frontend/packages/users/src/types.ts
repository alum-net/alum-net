export type UserRole = 'admin' | 'teacher' | 'student';

export interface UserInfo {
  role: UserRole;
}
