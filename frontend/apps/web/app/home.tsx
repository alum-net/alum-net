import { Calendar } from '@alum-net/users';
import { useState } from 'react';
import { View } from 'react-native';

export default function Home() {
  const [width, setWidth] = useState(0);
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
