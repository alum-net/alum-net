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
    queryKey: [QUERY_KEYS.getForumPosts, parentPostId],
    queryFn: () =>
      getForumPosts({ courseId, forumType, page, rootPost: parentPostId }),
  });

  return {
    data,
    isLoading,
  };
};
