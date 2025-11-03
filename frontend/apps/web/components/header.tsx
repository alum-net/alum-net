import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users/src/hooks/useUserInfo';
import { UserRole } from '@alum-net/users/src/types';

export default function WebHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: userInfo } = useUserInfo();
  const isAdmin = userInfo?.role === UserRole.admin;

  const navItems: {
    label: string;
    route: '/home' | '/profile' | '/users' | '/courses' | '/library';
  }[] = [
    { label: 'Inicio', route: '/home' },
    { label: 'Cursos', route: '/courses' },
    ...(isAdmin ? [{ label: 'Usuarios', route: '/users' as const }] : []),
    // { label: "Mensajes", route: "/messages" },
    { label: 'Libreria', route: '/library' },
    { label: 'Perfil', route: '/profile' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AlumNet</Text>

      <View style={styles.nav}>
        {navItems.map(item => {
          const isActive = pathname === item.route;
          return (
            <Pressable key={item.route} onPress={() => router.push(item.route)}>
              <Text style={[styles.link, isActive && styles.activeLink]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  logo: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.colors.primary,
  },
  nav: {
    flexDirection: 'row',
    gap: 24,
  },
  link: {
    color: '#C0C3CA',
    fontSize: 15,
    fontWeight: '500',
  },
  activeLink: {
    color: THEME.colors.secondary,
  },
});
