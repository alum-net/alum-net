import { useMemo, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { Button, Dialog, Portal, Text, useTheme } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useUserInfo } from '@alum-net/users';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '@alum-net/api';
import { THEME, Toast } from '@alum-net/ui';
import { UserRole } from '@alum-net/users/src/types';
import { ForumType, Post } from '../types';
import { useForumPosts } from '../hooks/useForumPosts';
import { deletePost } from '../service';
import { PostCard } from '../components/post-card';
import { PostCreationForm } from '../components/forum-post-creation';
import { AxiosError } from 'axios';
import { Response } from '@alum-net/api';

type UserAction = {
  action: 'update' | 'answer' | 'delete' | undefined;
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
        queryKey: [QUERY_KEYS.getForumPosts],
      });
      if (variables.isRoot) {
        router.back();
        await queryClient.refetchQueries({
          queryKey: [QUERY_KEYS.getForumPosts],
        });
      }
      Toast.success('Posteo eliminado correctamente');
      dismissAction();
    },
    onError: (error: any) => {
      const axiosError = error as AxiosError<Response>;
      
      if (axiosError?.response?.status === 401) {
        Toast.error('Tu sesión expiró. Por favor, volvé a iniciar sesión');
      } else {
        Toast.error('No pudimos eliminar el posteo');
      }
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

  const onDelete = (postToDelete: Post) => {
    setUserAction({ action: 'delete', data: postToDelete, showForm: true });
  };

  const dismissAction = () =>
    setUserAction({ action: undefined, data: undefined, showForm: false });

  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        {Platform.OS === 'web' && (
          <Button
            mode="text"
            icon="arrow-left"
            onPress={() => router.back()}
            style={styles.backButton}
          >
            Volver
          </Button>
        )}
        <PostCard
          key={parentPost.id}
          post={parentPost}
          isReply={false}
          userEmail={userInfo?.email ?? ''}
          marginMultiplier={0}
          deleteFn={onDelete}
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
      {userAction.showForm && userAction.action === 'delete' && (
        <Portal>
          <Dialog visible onDismiss={dismissAction} style={styles.dialog}>
            <Dialog.Title>Confirmar eliminación</Dialog.Title>
            <Dialog.Content style={styles.dialogContent}>
              <Text>¿Querés eliminar el posteo del foro?</Text>
            </Dialog.Content>
            <Dialog.Actions style={styles.dialogActions}>
              <Button onPress={dismissAction}>Cancelar</Button>
              <Button
                mode="contained-tonal"
                buttonColor={THEME.colors.error}
                textColor="#fff"
                onPress={() =>
                  deletePostMutation({
                    postId: userAction.data!.id,
                    isRoot: !userAction.data?.parentPost,
                  })
                }
              >
                Eliminar
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Portal>
      )}
      {userAction.showForm &&
        userAction.action &&
        ['answer', 'update'].includes(userAction.action) && (
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
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  dialog: {
    backgroundColor: 'white',
    alignSelf: 'center',
    width: 420,
    maxWidth: '90%',
    borderRadius: 12,
  },
  dialogContent: {
    paddingTop: 4,
  },
  dialogActions: {
    justifyContent: 'flex-end',
  },
});
