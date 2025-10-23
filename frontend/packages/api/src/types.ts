export type Response<T = undefined> = {
  errors: string[];
  message: string;
  success: true;
  data?: T;
};

type Pageable = {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};

export type PageableContent<T> = {
  pageable: Pageable;
  content: T[];
};

export type PageableResponse<T> = Response<T[]> & Pageable;
