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
