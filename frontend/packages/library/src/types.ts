import { UserInfo } from '@alum-net/users';

export type LibraryResource = {
  id: number;
  title: string;
  labels: Label[];
  name: string;
  url: string;
  extension: string;
  zeInBytes: number;
  creator: UserInfo;
};

export type Label = {
  id: number;
  name: string;
};

export interface LibraryResourceFilter {
  name?: string;
  labelIds?: number[];
}
