import { Stack } from 'expo-router';
import { useMMKVString } from 'react-native-mmkv';
import { PaperProvider } from 'react-native-paper';
import { THEME, ToastProvider } from '@alum-net/ui';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import WebHeader from '../components/header';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const InitialLayout = () => {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <PaperProvider theme={THEME}>
          {!!refreshToken && <WebHeader />}
          <Stack>
            <Stack.Protected guard={!refreshToken}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Protected guard={!!refreshToken}>
              <Stack.Screen name="home" options={{ headerShown: false }} />
              <Stack.Screen name="profile" options={{ headerShown: false }} />
              <Stack.Screen name="courses" options={{ headerShown: false }} />
              <Stack.Screen name="users" options={{ headerShown: false }} />
              <Stack.Screen
                name="course/[id]"
                options={{ headerShown: false }}
              />
              <Stack.Screen name="library" options={{ headerShown: false }} />
            </Stack.Protected>
            <Stack.Screen name="+not-found" />
          </Stack>
        </PaperProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}
