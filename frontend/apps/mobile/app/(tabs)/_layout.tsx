import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import { LogLevel, OneSignal } from 'react-native-onesignal';
import { UserRole, useUserInfo } from '@alum-net/users';
import { useMMKVString } from 'react-native-mmkv';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { logout } from '@alum-net/auth';
import { Toast } from '@alum-net/ui';
import { Avatar } from 'react-native-paper';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);
  const { data } = useUserInfo(!!refreshToken);

  useEffect(() => {
    OneSignal.Debug.setLogLevel(
      process.env.EXPO_PUBLIC_ENV === 'development'
        ? LogLevel.Verbose
        : LogLevel.None,
    );
    OneSignal.Debug.setAlertLevel(
      process.env.EXPO_PUBLIC_ENV === 'development'
        ? LogLevel.Verbose
        : LogLevel.None,
    );
    OneSignal.initialize(process.env.EXPO_PUBLIC_ONE_SIGNAL_ID || '');
    OneSignal.Notifications.requestPermission(true);
    OneSignal.Notifications.addEventListener('foregroundWillDisplay', event => {
      event.getNotification().display();
    });
  }, []);

  useEffect(() => {
    if (refreshToken && data?.role && data.role !== UserRole.student) {
      OneSignal.logout();
      logout();
      Toast.error('La aplicación movil solo esta disponible para estudiantes');
      return;
    }
    if (refreshToken && data?.email) {
      OneSignal.login(data.email);
    }
  }, [refreshToken, data]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2f95dc',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: 'Cursos',
          tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: data?.avatarUrl ? '' : 'Perfil',
          tabBarIcon: ({ color }) =>
            data?.avatarUrl ? (
              <Avatar.Image
                source={{ uri: data.avatarUrl, width: 28 }}
                style={{ marginBottom: -3 }}
              />
            ) : (
              <TabBarIcon name="user" color={color} />
            ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          title: 'Libreria',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="bookmark" color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="messaging"
        options={{
          title: 'Mensajes',
          tabBarIcon: ({ color }) => (
            <TabBarIcon name="comment" color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
