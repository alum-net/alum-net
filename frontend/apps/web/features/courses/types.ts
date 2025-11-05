export type FileMetadata = {
  filename: string;
  order: number;
};

export type FilesToUpload = {
  uri: string;
  name: string;
  type?: string;
  id?: number;
};

export type SectionData = {
  title: string;
  description?: string;
  resourcesMetadata?: FileMetadata[];
  eliminatedResourcesIds?: number[];
};

export type BulkCreationError = {
  lineNumber: number;
  identifier?: string;
  reason: string;
};

export type BulkCreationResponse = {
  totalRecords: number;
  successfulCreations: number;
  failedCreations: number;
  errors: BulkCreationError[];
};