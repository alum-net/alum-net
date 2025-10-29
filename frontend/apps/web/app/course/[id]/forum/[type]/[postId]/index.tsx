import React, { useMemo, useState } from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Platform,
} from 'react-native';
import { Card, Text, Button, useTheme } from 'react-native-paper';
import {
  deletePost,
  ForumType,
  Post,
  PostCreationForm,
  updatePost,
  useForumPosts,
} from '@alum-net/forums';
import { useLocalSearchParams, useRouter } from 'expo-router';
import RenderHTML from 'react-native-render-html';
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

export default function ForumThread() {
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
        queryKey: [QUERY_KEYS.getForumPosts, undefined],
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

  if (data?.totalElements === 0) return router.back();

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
}

const PostCard = ({
  post,
  isReply,
  userEmail,
  marginMultiplier,
  deleteFn,
  updateFn,
  createFn,
}: {
  post: Post;
  isReply: boolean;
  userEmail: string;
  marginMultiplier: number;
  deleteFn: (data: { postId: string; isRoot: boolean }) => void;
  updateFn: undefined | ((data: Post) => void);
  createFn: undefined | ((data: Post) => void);
}) => {
  const theme = useTheme();
  const [contentWidth, setContentWidth] = useState(0);

  return (
    <>
      <Card
        style={[
          styles.card,
          isReply && {
            marginLeft: 10 * marginMultiplier,
          },
        ]}
      >
        {isReply && (
          <View
            style={[
              styles.verticalLine,
              { backgroundColor: theme.colors.outline },
            ]}
          />
        )}
        <Card.Content
          onLayout={event => setContentWidth(event.nativeEvent.layout.width)}
          style={{ padding: 15 }}
        >
          <View style={styles.headerRow}>
            <Text style={styles.author}>{post.author.name}</Text>
            <Text style={styles.timeAgo}>
              {new Date(post.createdAt).toLocaleDateString()}
            </Text>
          </View>

          {!isReply && (
            <Text variant="titleMedium" style={styles.title}>
              {post.title}
            </Text>
          )}

          <RenderHTML
            baseStyle={styles.content}
            source={{ html: post.content }}
            contentWidth={contentWidth}
          />

          <View style={styles.actionsRow}>
            {createFn && (
              <Button compact mode="text" onPress={() => createFn(post)}>
                Responder
              </Button>
            )}
            {post.author.email === userEmail && (
              <>
                <Button
                  compact
                  mode="text"
                  textColor={theme.colors.error}
                  onPress={() =>
                    deleteFn({
                      postId: post.id,
                      isRoot: post.parentPost === null,
                    })
                  }
                >
                  Eliminar
                </Button>
                {post.totalResponses <= 0 && updateFn && (
                  <Button compact mode="text" onPress={() => updateFn(post)}>
                    Editar
                  </Button>
                )}
              </>
            )}
          </View>
        </Card.Content>
      </Card>

      {post.responses?.length > 0 && (
        <View>
          {post.responses.map(reply => (
            <PostCard
              key={reply.id}
              post={reply}
              isReply
              userEmail={userEmail}
              marginMultiplier={
                marginMultiplier + Platform.OS === 'web' ? 1 : 0.5
              }
              deleteFn={deleteFn}
              updateFn={updateFn}
              createFn={createFn}
            />
          ))}
        </View>
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
  verticalLine: {
    position: 'absolute',
    left: -12,
    top: 0,
    bottom: 0,
    width: 2,
    borderRadius: 1,
  },
  card: {
    borderRadius: 8,
    elevation: 1,
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  author: {
    fontWeight: '600',
  },
  title: {
    marginBottom: 4,
  },
  timeAgo: {
    color: 'gray',
    fontSize: 12,
  },
  content: {
    marginBottom: 10,
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
