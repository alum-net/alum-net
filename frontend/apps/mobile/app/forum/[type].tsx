import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function Forum() {
  const { type, courseId } = useLocalSearchParams();

  return (
    <View>
      {type}
      {courseId}
    </View>
  );
}
