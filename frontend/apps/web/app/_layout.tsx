import { Stack } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import { storage, STORAGE_KEYS } from "@alum-net/storage";

const InitialLayout = () => {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);

  return (
    <Stack>
      <Stack.Protected guard={!refreshToken}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!!refreshToken}>
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}
