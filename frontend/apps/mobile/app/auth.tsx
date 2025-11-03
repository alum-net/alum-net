import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { ActivityIndicator } from 'react-native-paper';
import Screen from '../components/screen';
import { useUserInfo } from '@alum-net/users';
import { OneSignal } from 'react-native-onesignal';

export default function Auth() {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);
  const { data } = useUserInfo(!!refreshToken);
  const nav = useRouter();

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (refreshToken && data?.email) {
        OneSignal.login(data.email);
      } else if (!refreshToken) {
        OneSignal.logout();
      }
      console.log('me fui');
      nav.replace({
        pathname: refreshToken ? '/(tabs)' : '/',
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [nav, refreshToken, data]);

  return (
    <Screen style={{ justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator />
    </Screen>
  );
}
