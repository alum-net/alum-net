import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { Course } from '../types';
import { useUserInfo } from '@alum-net/users';

export const CourseCard = ({ course }: { course: Course }) => {
  const { userInfo } = useUserInfo();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.courseTitle}>{course.title}</Text>
        </View>
        <Text style={styles.instructor}>{course.instructor}</Text>
        {userInfo?.role === 'admin' && (
          <Button
            mode="text"
            style={styles.button}
            labelStyle={styles.buttonLabel}
          >
            Eliminar
          </Button>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    minWidth: Platform.OS === 'web' ? 200 : undefined,
    width: Platform.OS === 'android' ? '45%' : undefined,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 8,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  instructor: {
    color: '#999999',
    fontSize: 12,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    alignItems: 'flex-start',
  },
  buttonLabel: {
    fontSize: 12,
    color: '#9e0000ff',
  },
});
