export enum ForumType {
  ANNOUNCE = 'announce',
  GENERAL = 'general',
}

export type Post = {
  id: string;
  courseId: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  parentPost: string;
  rootPost: string;
  author: Author;
  totalResponses: number;
  responses: Post[];
};

type Author = {
  name: string;
  email: string;
};

export interface PostCreationRequest {
  forumType: ForumType;
  courseId: number;
  title: string;
  content: string;
  parentPost?: string | null;
  rootPost?: string | null;
  author: Author;
}

export interface UpdatePostRequest {
  message?: string;
  title?: string;
}
