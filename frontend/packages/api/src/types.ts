export type WebNotifications = {
  type: 'ANNOUNCE' | 'GRADE_PUBLICATION';
  title: string;
  message: string;
};

export type Response<T = undefined> = {
  errors: string[];
  message: string;
  success: boolean;
  data?: T;
  statusCode: number;
  notifications: WebNotifications[];
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
};

export type PageableContent<T> = {
  pageable: Pageable;
  data: T[];
};

export type PageableResponse<T> = Response<T[]> & Pageable;
