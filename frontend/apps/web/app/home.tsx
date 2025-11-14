import { Calendar, UserRole, useUserInfo } from '@alum-net/users';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { View } from 'react-native';

export default function Home() {
  const [width, setWidth] = useState(0);
  const nav = useRouter();
  const { data } = useUserInfo();

  useFocusEffect(
    useCallback(() => {
      if (data?.role === UserRole.admin) nav.replace('/courses');
    }, [data, nav]),
  );
  return (
    <View
      style={{
        flex: 1,
        padding: 15,
      }}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
    >
      <Calendar width={width - 30} />
    </View>
  );
}
