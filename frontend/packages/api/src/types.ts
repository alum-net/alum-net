export type Response<T = undefined> = {
  errors: string[];
  message: string;
  success: true;
  data?: T;
};

export type PaginatedResponse<T> = Response<T> & {
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
};
