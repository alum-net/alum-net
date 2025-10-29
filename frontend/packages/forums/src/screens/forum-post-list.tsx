import { useState } from 'react';
import { useForumPosts } from '../hooks/useForumPosts';
import { ForumType } from '../types';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Divider, FAB, Text } from 'react-native-paper';
import { ForumPost } from '../components/forum-post';
import { THEME } from '@alum-net/ui';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { PostCreationForm } from '../components/forum-post-creation';
import { UserRole } from '@alum-net/users/src/types';
import { useUserInfo } from '@alum-net/users';

export function ForumPostList() {
  const { id, type } = useLocalSearchParams<{
    type: ForumType;
    id: string;
  }>();
  const [page, setPage] = useState(0);
  const { data } = useForumPosts(id, type, page);
  const nav = useRouter();
  const { data: userInfo } = useUserInfo();
  const [createPost, setCreatePost] = useState(false);

  const selectPost = (postId: string) => {
    nav.navigate({
      pathname: '/course/[id]/forum/[type]/[postId]',
      params: {
        id,
        type,
        postId,
      },
    });
  };

  const headerTitle =
    type === ForumType.ANNOUNCE
      ? 'Anuncios del curso'
      : 'Preguntas y respuestas';

  const headerSubtitle =
    type === ForumType.ANNOUNCE
      ? 'Mantente al día con las novedades del curso.'
      : 'Discute temas del curso y comparte recursos con tus compañeros.';

  return (
    <>
      <View style={styles.container}>
        <Text variant="headlineSmall" style={styles.header}>
          {headerTitle}
        </Text>
        <Text variant="bodyMedium" style={styles.subHeader}>
          {headerSubtitle}
        </Text>

        <Divider style={styles.divider} />

        <FlatList
          data={data?.data}
          renderItem={({ item }) => (
            <ForumPost item={item} handleSelectPost={selectPost} />
          )}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No hay publicaciones aún.</Text>
          }
          ListFooterComponent={
            data && data.totalPages > 0 ? (
              <View style={styles.paginationContainer}>
                {data.pageNumber > 0 && (
                  <Button
                    mode="contained-tonal"
                    onPress={() => setPage(page - 1)}
                    buttonColor={THEME.colors.black}
                    labelStyle={styles.paginationButtonLabel}
                  >
                    Página anterior
                  </Button>
                )}
                {data.pageNumber < data.totalPages - 1 && (
                  <Button
                    mode="contained-tonal"
                    onPress={() => setPage(page + 1)}
                    buttonColor={THEME.colors.black}
                    labelStyle={styles.paginationButtonLabel}
                  >
                    Página siguiente
                  </Button>
                )}
              </View>
            ) : null
          }
        />

        {(userInfo?.role === UserRole.student && type === ForumType.ANNOUNCE) ||
          (userInfo?.role !== UserRole.admin && (
            <>
              <FAB
                icon="plus"
                label="Nueva publicación"
                style={styles.fab}
                onPress={() => setCreatePost(true)}
              />

              <PostCreationForm
                courseId={Number(id)}
                forumType={type}
                onDismiss={() => setCreatePost(false)}
                isVisible={createPost}
              />
            </>
          ))}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  header: {
    fontWeight: '600',
    marginBottom: 4,
  },
  subHeader: {
    color: '#3b82f6',
    marginBottom: 16,
  },
  divider: {
    marginBottom: 16,
  },
  list: {
    paddingBottom: 100,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  paginationContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  paginationButtonLabel: {
    color: 'white',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
