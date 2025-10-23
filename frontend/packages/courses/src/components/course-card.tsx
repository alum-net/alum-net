import { Platform, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';
import { CourseDisplay } from '../types';
import { mapShiftToString } from '../helpers';
import DeleteCourseButton from './delete-course';
import { Link } from 'expo-router';

export const CourseCard = ({ course }: { course: CourseDisplay }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <Link
            style={styles.courseTitle}
            href={{
              pathname: '/course/[id]',
              params: { id: course.id },
            }}
          >
            {course.name}
          </Link>
        </View>
        {course.teachers.map(teacher => (
          <Text key={teacher.email} style={styles.instructor}>
            {teacher.name + ' ' + teacher.lastname}
          </Text>
        ))}
        <Text style={styles.instructor}>
          Turno: {mapShiftToString(course.shiftType)}
        </Text>
        <Text style={styles.instructor}>
          Fecha de inicio: {new Date(course.startDate).toDateString()}
        </Text>
        <Text style={styles.instructor}>
          Fecha de fin: {new Date(course.endDate).toDateString()}
        </Text>
        <DeleteCourseButton courseId={course.id} />
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
});
