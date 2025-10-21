import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-paper';
import { CourseDisplay } from '../types';
import { useUserInfo } from '@alum-net/users';
import { mapShiftToString } from '../helpers';

export const CourseCard = ({ course }: { course: CourseDisplay }) => {
  const { userInfo } = useUserInfo();

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text style={styles.courseTitle}>{course.name}</Text>
        </View>
        {course.teachersNames.map(name => (
          <Text key={course.id + name} style={styles.instructor}>
            {name}
          </Text>
        ))}
        <Text style={styles.instructor}>
          Turno: {mapShiftToString(course.shift)}
        </Text>
        <Text style={styles.instructor}>
          Fecha de inicio: {course.startDate.toDateString()}
        </Text>
        <Text style={styles.instructor}>
          Fecha de fin: {course.endDate.toDateString()}
        </Text>
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
