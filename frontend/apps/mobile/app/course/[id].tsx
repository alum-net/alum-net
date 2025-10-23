import { useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

export default function Course() {
  const { id } = useLocalSearchParams();

  return <View>{id}</View>;
}
