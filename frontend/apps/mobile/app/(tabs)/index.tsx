import Screen from '../../components/screen';
import { Calendar } from '@alum-net/users';
import { useState } from 'react';

export default function TabOneScreen() {
  const [width, setWidth] = useState(0);

  return (
    <Screen
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      scrollable={false}
    >
      <Calendar width={width - 35} />
    </Screen>
  );
}
