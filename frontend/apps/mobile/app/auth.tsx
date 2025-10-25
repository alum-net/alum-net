import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { ActivityIndicator } from 'react-native-paper';
import Screen from '../components/screen';

export default function Auth() {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);
  const nav = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      nav.replace({
        pathname: refreshToken ? '/(tabs)' : '/',
      });
    }, 200);

    return () => clearTimeout(timeout);
  });

  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </Screen>
  );
}
