import { ForumType, Post } from '@alum-net/forums';
import { useUserInfo } from '@alum-net/users';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Avatar, Card, Divider, FAB, Text } from 'react-native-paper';

const RenderItem = ({
  item,
  handleSelectPost,
  handleDeletePost,
}: {
  item: Post;
  handleSelectPost: (postId: string) => void;
  handleDeletePost?: (postId: string) => void;
}) => (
  <Card
    style={styles.card}
    onPress={() => handleSelectPost(item.id)}
    mode="outlined"
  >
    <Card.Content style={styles.cardContent}>
      <Avatar.Text
        size={40}
        label={item.author.name.charAt(0)}
        style={styles.avatar}
      />
      <View style={styles.textContainer}>
        <Text variant="titleMedium" style={styles.title}>
          {item.title}
        </Text>
        <Text variant="bodySmall" style={styles.subtitle}>
          Publicado por {item.author.name} ·{' '}
          {new Date(item.createdAt).toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'short',
          })}
        </Text>

        <Text variant="bodySmall" style={styles.responses}>
          {item.totalResponses} respuestas
        </Text>
        {handleDeletePost && (
          <Text
            variant="bodySmall"
            style={styles.deleteText}
            onPress={() => handleDeletePost(item.id)}
          >
            Eliminar
          </Text>
        )}
      </View>
    </Card.Content>
  </Card>
);

export default function ForumScreen() {
  const { type, courseId } = useLocalSearchParams<{
    type: ForumType;
    courseId: string;
  }>();
  const { data: userInfo } = useUserInfo();

  const forumType = type as ForumType;

  const [posts] = useState<Post[]>([
    {
      id: '1',
      courseId: Number(courseId),
      title: 'Bienvenida al curso',
      content: 'Estamos felices de iniciar un nuevo ciclo académico.',
      createdAt: new Date(),
      updatedAt: new Date(),
      parentPost: '',
      rootPost: '',
      author: { email: 'teacher@alumnet.com', name: 'Profesor García' },
      totalResponses: 3,
      responses: [],
    },
  ]);

  const handleNewPost = () => {
    console.log('Crear nueva publicación');
  };

  const selectPost = (postId: string) => {
    console.log('Ver detalles de publicación:', postId);
  };

  const deletePost = (postId: string) => {
    console.log('Eliminar publicación:', postId);
  };

  const headerTitle =
    forumType === ForumType.ANNOUNCE
      ? 'Anuncios del curso'
      : 'Preguntas y respuestas';

  const headerSubtitle =
    forumType === ForumType.ANNOUNCE
      ? 'Mantente al día con las novedades del curso.'
      : 'Discute temas del curso y comparte recursos con tus compañeros.';

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.header}>
        {headerTitle}
      </Text>
      <Text variant="bodyMedium" style={styles.subHeader}>
        {headerSubtitle}
      </Text>

      <Divider style={styles.divider} />

      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <RenderItem
            item={item}
            handleSelectPost={selectPost}
            handleDeletePost={
              userInfo?.email === item.author.email ? deletePost : undefined
            }
          />
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay publicaciones aún.</Text>
        }
      />

      <FAB
        icon="plus"
        label="Nueva publicación"
        style={styles.fab}
        onPress={handleNewPost}
      />
    </View>
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
  card: {
    marginBottom: 12,
    borderRadius: 12,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 12,
    backgroundColor: '#3b82f6',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
  },
  subtitle: {
    color: '#6b7280',
  },
  responses: {
    color: '#64748b',
    marginTop: 2,
  },
  deleteText: {
    color: '#ef4444',
    marginTop: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    marginTop: 40,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
  },
});
