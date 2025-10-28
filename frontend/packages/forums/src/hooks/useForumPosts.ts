import { useQuery } from '@tanstack/react-query';
import { getForumPosts } from '../service';
import { QUERY_KEYS } from '@alum-net/api';
import { ForumType } from '../types';

export const useForumPosts = (
  courseId: string,
  forumType: ForumType,
  page = 0,
  parentPostId?: string,
) => {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.getForumPosts],
    queryFn: () => getForumPosts({ courseId, forumType, page, parentPostId }),
  });

  return {
    data,
    isLoading,
  };
};
