import Screen from '../../../components/screen';
import { ChatScreen } from '@alum-net/messaging';

export default function Chat() {
  return (
    <Screen scrollable={false} edges={['top']}>
      <ChatScreen />
    </Screen>
  );
}
