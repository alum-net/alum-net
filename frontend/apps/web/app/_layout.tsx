import { Stack } from "expo-router";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@alum-net/storage";

const InitialLayout = () => {
  const [token] = useMMKVString("token", storage);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Protected guard={!!token}>
        <Stack.Screen name="home" />
      </Stack.Protected>
    </Stack>
  );
};

export default function RootLayout() {
  return <InitialLayout />;
}
