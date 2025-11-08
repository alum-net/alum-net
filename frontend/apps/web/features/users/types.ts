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

export type UserActivityLog = {
  id: number;
  userEmail: string;
  type: string;
  description?: string | null;
  resourceId?: string | null;
  timestamp: string;
};
