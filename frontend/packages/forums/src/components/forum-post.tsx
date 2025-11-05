import { Avatar, Card, Text } from 'react-native-paper';
import { Post } from '../types';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export const ForumPost = ({
  item,
  handleSelectPost,
}: {
  item: Post;
  handleSelectPost: (postId: string) => void;
}) => (
  <TouchableOpacity onPress={() => handleSelectPost(item.id)}>
    <Card style={styles.card} mode="outlined">
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
        </View>
      </Card.Content>
    </Card>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
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
});
