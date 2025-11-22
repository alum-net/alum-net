import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { THEME } from '@alum-net/ui';
import { useUserInfo } from '@alum-net/users/src/hooks/useUserInfo';
import { UserRole } from '@alum-net/users/src/types';
import { useConversations } from '@alum-net/messaging';
import { Avatar } from 'react-native-paper';

export default function WebHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const { data: userInfo } = useUserInfo();
  const { data: conversations } = useConversations(userInfo?.role);

  const totalUnreadCount = useMemo(() => {
    if (!conversations) return 0;
    return conversations.reduce((total, conversation) => {
      return total + (conversation.unreadCount ?? 0);
    }, 0);
  }, [conversations]);

  const navItems: {
    label: string;
    route:
      | '/home'
      | '/profile'
      | '/users'
      | '/courses'
      | '/library'
      | '/messaging';
    badge?: number;
  }[] = [
    ...(userInfo?.role !== UserRole.admin
      ? [{ label: 'Inicio', route: '/home' as const }]
      : []),
    { label: 'Cursos', route: '/courses' },
    ...(userInfo?.role === UserRole.admin
      ? [{ label: 'Usuarios', route: '/users' as const }]
      : []),
    ...(userInfo && userInfo.role !== UserRole.admin
      ? [
          {
            label: 'Mensajes',
            route: '/messaging' as const,
            badge: totalUnreadCount > 0 ? totalUnreadCount : undefined,
          },
        ]
      : []),
    { label: 'Libreria', route: '/library' },
    { label: 'Perfil', route: '/profile' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AlumNet</Text>

      <View style={styles.nav}>
        {navItems.map(item => {
          const isActive = pathname === item.route;
          const hasBadge = item.badge !== undefined && item.badge > 0;

          return (
            <Pressable key={item.route} onPress={() => router.push(item.route)}>
              <View style={styles.navItemContainer}>
                {item.route === '/profile' && userInfo?.avatarUrl ? (
                  <Avatar.Image
                    size={20}
                    style={{ marginLeft: 10 }}
                    source={{ uri: userInfo.avatarUrl }}
                  />
                ) : (
                  <Text style={[styles.link, isActive && styles.activeLink]}>
                    {item.label}
                  </Text>
                )}
                {hasBadge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {item.badge! > 99 ? '99+' : String(item.badge)}
                    </Text>
                  </View>
                )}
              </View>
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
  navItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  link: {
    color: '#C0C3CA',
    fontSize: 15,
    fontWeight: '500',
  },
  activeLink: {
    color: THEME.colors.secondary,
  },
  badge: {
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
    lineHeight: 10,
  },
});
