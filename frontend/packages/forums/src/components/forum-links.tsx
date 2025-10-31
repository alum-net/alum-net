import { Link } from 'expo-router';
import { View } from 'react-native';
import { Button } from 'react-native-paper';
import { ForumType } from '../types';

export function ForumLinks({ courseId }: { courseId: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
      <Button mode="text">
        <Link
          href={{
            pathname: `/course/[id]/forum/[type]`,
            params: {
              type: ForumType.ANNOUNCE,
              id: courseId,
            },
          }}
        >
          Foro de avisos
        </Link>
      </Button>
      <Button mode="text">
        <Link
          href={{
            pathname: `/course/[id]/forum/[type]`,
            params: {
              type: ForumType.GENERAL,
              id: courseId,
            },
          }}
        >
          Foro de consultas
        </Link>
      </Button>
    </View>
  );
}
