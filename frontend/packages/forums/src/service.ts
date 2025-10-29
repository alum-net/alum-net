import api, { PageableResponse } from '@alum-net/api';
import { AxiosResponse } from 'axios';
import {
  ForumType,
  Post,
  PostCreationRequest,
  UpdatePostRequest,
} from './types';

export const getForumPosts = async (params: {
  courseId: string;
  forumType: ForumType;
  rootPost?: string;
  page: number;
}) => {
  const { data }: AxiosResponse<PageableResponse<Post>> = await api.get(
    'forums/posts',
    {
      params,
    },
  );

  return data;
};

export const createPost = async (data: PostCreationRequest) =>
  await api.post('/forums/posts', data);

export const updatePost = async (postId: string, data: UpdatePostRequest) =>
  await api.patch(`/forums/posts/${postId}`, data);

export const deletePost = async (postId: string) =>
  await api.delete(`/forums/posts/${postId}`);
