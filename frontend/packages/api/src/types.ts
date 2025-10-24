export type Response<T = undefined> = {
  errors: string[];
  message: string;
  success: boolean;
  data?: T;
  statusCode: number;
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
  content: T[];
};

export type PageableResponse<T> = Response<T[]> & Pageable;
