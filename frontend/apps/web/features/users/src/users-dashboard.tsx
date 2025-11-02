import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

type Props = {
  children: React.ReactNode;
};

export default function UsersDashboard({ children }: Props) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: '#f6f6f6',
  },
  content: {
    padding: 24,
    gap: 16,
  },
});
