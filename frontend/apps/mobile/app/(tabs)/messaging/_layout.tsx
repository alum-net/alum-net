import { Stack } from 'expo-router';
import { MessagingProvider } from '@alum-net/messaging';

export default function MessagingLayout() {
  return (
    <MessagingProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="[id]" options={{ headerShown: false }} />
      </Stack>
    </MessagingProvider>
  );
}
