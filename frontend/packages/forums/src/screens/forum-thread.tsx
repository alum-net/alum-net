import { useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useTheme } from 'react-native-paper';
import {
  deletePost,
  ForumType,
  Post,
  PostCard,
  PostCreationForm,
  useForumPosts,
} from '@alum-net/forums';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { Toast } from '@alum-net/ui';
import { UserRole } from '@alum-net/users/src/types';

type UserAction = {
  action: 'update' | 'answer' | undefined;
  showForm: boolean;
  data?: Post;
};

export const ForumThread = () => {
  const { id, type, postId } = useLocalSearchParams<{
    id: string;
    type: ForumType;
    postId: string;
  }>();
  const theme = useTheme();
  const { data, isLoading } = useForumPosts(id, type, 0, postId);
  const { data: userInfo } = useUserInfo();
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: (data: { postId: string; isRoot: boolean }) =>
      deletePost(data.postId),
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.getForumPosts, postId],
      });
      if (variables.isRoot) router.back();
      Toast.success('Posteo eliminado correctamente');
    },
    onError: () => {
      Toast.error('No pudimos eliminar el posteo');
    },
  });

  const parentPost = useMemo(
    () => data?.data?.find(post => post.parentPost === null),
    [data?.data],
  );
  const [userAction, setUserAction] = useState<UserAction>({
    action: 'answer',
    showForm: false,
  });

  if (data?.totalElements === 0) {
    router.back();
    return null;
  }

  if (isLoading || !parentPost) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator animating color={theme.colors.primary} />
      </View>
    );
  }

  const onUpdate = (postToUpdate: Post) => {
    setUserAction({ action: 'update', data: postToUpdate, showForm: true });
  };

  const onCreate = (postToAnswerTo: Post) => {
    setUserAction({ action: 'answer', data: postToAnswerTo, showForm: true });
  };

  const dismissAction = () =>
    setUserAction({ action: undefined, data: undefined, showForm: false });

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        <PostCard
          key={parentPost.id}
          post={parentPost}
          isReply={false}
          userEmail={userInfo?.email ?? ''}
          marginMultiplier={0}
          deleteFn={deletePostMutation}
          updateFn={
            userInfo?.role === UserRole.teacher ||
            (type === ForumType.GENERAL && userInfo?.role !== UserRole.admin)
              ? onUpdate
              : undefined
          }
          createFn={
            userInfo?.role === UserRole.teacher ||
            (type === ForumType.GENERAL && userInfo?.role !== UserRole.admin)
              ? onCreate
              : undefined
          }
          userRole={userInfo!.role}
        />
      </ScrollView>
      {userAction.showForm && (
        <PostCreationForm
          forumType={type}
          courseId={Number(id)}
          updateInitialData={
            userAction.action === 'update' ? userAction.data : undefined
          }
          creationParentPost={
            userAction.action === 'answer' ? userAction.data?.id : undefined
          }
          creationRootPost={
            userAction.action === 'answer'
              ? userAction.data?.rootPost || userAction.data?.id
              : undefined
          }
          onDismiss={dismissAction}
          isVisible={userAction.showForm}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
