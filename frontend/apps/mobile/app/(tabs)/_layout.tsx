import React, { useEffect } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

import Colors from '../../constants/Colors';
import { useColorScheme } from 'react-native';
import { OneSignal } from 'react-native-onesignal';
import { UserRole, useUserInfo } from '@alum-net/users';
import { useMMKVString } from 'react-native-mmkv';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { logout } from '@alum-net/auth';
import { Toast } from '@alum-net/ui';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const [refreshToken] = useMMKVString(STORAGE_KEYS.REFRESH_TOKEN, storage);
  const { data } = useUserInfo(!!refreshToken);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (refreshToken && data?.role && data.role !== UserRole.student) {
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
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
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
          title: 'Perfil',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />,
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
