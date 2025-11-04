import Screen from '../../components/screen';
import { EventDetails } from '@alum-net/courses';

export default function Event() {
  return (
    <Screen edges={['top']}>
      <EventDetails />
    </Screen>
  );
}
