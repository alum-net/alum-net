import Screen from '../../../components/screen';
import { ChatListScreen, useMessaging } from '@alum-net/messaging';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function ChatsScreen() {
  const { selectedConversation } = useMessaging();
  const nav = useRouter();

  useEffect(() => {
    if (selectedConversation) {
      nav.push('/(tabs)/messaging/[id]');
    }
  }, [selectedConversation, nav]);

  return (
    <Screen scrollable={false} edges={['top', 'bottom']}>
      <ChatListScreen />
    </Screen>
  );
}
