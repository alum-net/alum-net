import { Stack } from 'expo-router';
import { useMMKVString } from 'react-native-mmkv';
import { PaperProvider } from 'react-native-paper';
import { THEME } from '@alum-net/ui';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import WebHeader from '../components/header';

const InitialLayout = () => {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);

  return (
    <PaperProvider theme={THEME}>
      {!!refreshToken && <WebHeader />}
      <Stack>
        <Stack.Protected guard={!refreshToken}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
        </Stack.Protected>
        <Stack.Protected guard={!!refreshToken}>
          <Stack.Screen name="home" options={{ headerShown: false }} />
          <Stack.Screen name="profile" options={{ headerShown: false }} />
        </Stack.Protected>
      </Stack>
    </PaperProvider>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}
