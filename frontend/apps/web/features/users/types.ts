export type BulkUserCreationError = {
  lineNumber: number;
  identifier: string;
  reason: string;
};

export type BulkUserCreationResponse = {
  totalRecords: number;
  successfulCreations: number;
  failedCreations: number;
  errors: BulkUserCreationError[];
};