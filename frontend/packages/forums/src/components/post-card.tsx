import { Button, Card, Text, useTheme } from 'react-native-paper';
import { Post } from '../types';
import { useState } from 'react';
import { RenderHTML } from 'react-native-render-html';
import { Platform, StyleSheet, View } from 'react-native';
import { UserRole } from '@alum-net/users/src/types';

export const PostCard = ({
  post,
  isReply,
  userEmail,
  marginMultiplier,
  deleteFn,
  updateFn,
  createFn,
  userRole,
}: {
  post: Post;
  isReply: boolean;
  userEmail: string;
  marginMultiplier: number;
  deleteFn: (data: { postId: string; isRoot: boolean }) => void;
  updateFn: undefined | ((data: Post) => void);
  createFn: undefined | ((data: Post) => void);
  userRole: UserRole;
}) => {
  const theme = useTheme();
  const [contentWidth, setContentWidth] = useState(0);

  return (
    <View
      style={
        isReply && {
          marginLeft: 50 * marginMultiplier,
        }
      }
    >
      <Card style={[styles.card]}>
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
            {(post.author.email === userEmail ||
              userRole === UserRole.teacher) && (
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
            )}
            {post.author.email === userEmail &&
              post.totalResponses <= 0 &&
              updateFn && (
                <Button compact mode="text" onPress={() => updateFn(post)}>
                  Editar
                </Button>
              )}
          </View>
        </Card.Content>
      </Card>

      {post.responses && post.responses.length > 0 && (
        <View>
          {post.responses.map(reply => (
            <PostCard
              key={reply.id}
              post={reply}
              isReply
              userEmail={userEmail}
              marginMultiplier={
                marginMultiplier + Platform.OS === 'web' ? 2 : 0.5
              }
              deleteFn={deleteFn}
              updateFn={updateFn}
              createFn={createFn}
              userRole={userRole}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
