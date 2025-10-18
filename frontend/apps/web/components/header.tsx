import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter, usePathname } from "expo-router";

export default function WebHeader() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems: {
    label: string;
    route: "/home" | "/profile";
  }[] = [
    { label: "Inicio", route: "/home" },
    // { label: "Cursos", route: "/courses" },
    // { label: "Mensajes", route: "/messages" },
    { label: "Perfil", route: "/profile" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>AlumNet</Text>

      <View style={styles.nav}>
        {navItems.map((item) => {
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
    width: "100%",
    height: 56,
    backgroundColor: "#111", // dark header background
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  logo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  nav: {
    flexDirection: "row",
    gap: 24,
  },
  link: {
    color: "#ccc",
    fontSize: 15,
    fontWeight: "500",
  },
  activeLink: {
    color: "#3b82f6", // blue accent for active item
  },
});
