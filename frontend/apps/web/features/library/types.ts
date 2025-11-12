export type UpdateLabelRequest = {
  name: string;
};

export type LibraryResourceUpdateRequest = {
  title: string;
  labelIds: number[];
  currentUserEmail: string;
};
