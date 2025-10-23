import { Stack } from 'expo-router';
import { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import 'react-native-reanimated';
import { PaperProvider } from 'react-native-paper';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { THEME, ToastProvider } from '@alum-net/ui';
import { useMMKVString } from 'react-native-mmkv';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { KeyboardProvider } from 'react-native-keyboard-controller';
export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
const queryClient = new QueryClient();

const InitialLayout = () => {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <ToastProvider>
          <PaperProvider theme={THEME}>
            <Stack>
              <Stack.Protected guard={!refreshToken}>
                <Stack.Screen name="index" options={{ headerShown: false }} />
              </Stack.Protected>
              <Stack.Protected guard={!!refreshToken}>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="course/[id]"
                  options={{ headerShown: false }}
                />
              </Stack.Protected>
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="auth" options={{ headerShown: false }} />
            </Stack>
          </PaperProvider>
        </ToastProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
};

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  return <InitialLayout />;
}
