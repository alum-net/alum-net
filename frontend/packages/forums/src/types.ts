export enum ForumType {
  ANNOUNCE = 'ANNOUNCE',
  GENERAL = 'GENERAL',
}

export type Post = {
  id: string;
  courseId: number;
  title: string | null;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  parentPost: string | null;
  rootPost: string | null;
  author: Author;
  totalResponses: number;
  responses: Post[] | null;
};

type Author = {
  name: string;
  email: string;
};

export interface PostCreationRequest {
  forumType: ForumType;
  courseId: number;
  title?: string;
  content: string;
  parentPost?: string | null;
  rootPost?: string | null;
  author: Author;
}

export interface UpdatePostRequest {
  content: string;
  title?: string;
}
