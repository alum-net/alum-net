import React, { useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { Card, Text, Button, useTheme, Portal } from 'react-native-paper';
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
  data: Post | undefined;
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

  const { mutate: updatePostMutation } = useMutation({
    mutationFn: (data: Post) =>
      updatePost(data.id, { content: data.content, title: data.title }),
    onSuccess: () => {
      Toast.success('Posteo editado correctamente');
    },
    onError: () => {
      Toast.error('Error al intentar editar posteo');
    },
  });

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
    action: undefined,
    showForm: false,
    data: undefined,
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
    setUserAction({ action: 'update', data: postToAnswerTo, showForm: true });
  };

  return (
    <>
      <ScrollView style={styles.container}>
        <PostCard
          key={parentPost.id}
          post={parentPost}
          isReply={false}
          userEmail={userInfo?.email ?? ''}
          marginMultiplier={0}
          deleteFn={deletePostMutation}
          updateFn={
            type === ForumType.GENERAL && userInfo?.role !== UserRole.admin
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
      <PostCreationForm
        forumType={type}
        courseId={Number(id)}
        updateInitialData={userAction.data}
        onUpdate={
          userAction.action === 'answer' ? updatePostMutation : undefined
        }
        creationParentPost={userAction.data?.parentPost}
        creationRootPost={userAction.data?.rootPost}
      />
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
    <View
      style={[
        styles.commentContainer,
        isReply && {
          marginLeft: 24 * marginMultiplier,
          position: 'relative',
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

      <Card style={styles.card}>
        <Card.Content
          onLayout={event => setContentWidth(event.nativeEvent.layout.width)}
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
                <Button compact mode="text" onPress={() => updateFn?.(post)}>
                  Editar
                </Button>
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
              marginMultiplier={marginMultiplier + 1}
              deleteFn={deleteFn}
              updateFn={updateFn}
              createFn={createFn}
            />
          ))}
        </View>
      )}
    </View>
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
  commentContainer: {
    marginBottom: 12,
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
});
