import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  MessagingProvider,
  ChatListScreen,
  ChatScreen,
} from '@alum-net/messaging';

export default function Messaging() {
  return (
    <MessagingProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.sidebar}>
            <ChatListScreen />
          </View>
          <View style={styles.mainArea}>
            <ChatScreen />
          </View>
        </View>
      </View>
    </MessagingProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f6f6',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontWeight: '700',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  sidebar: {
    minWidth: 350,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderRightColor: '#ddd',
  },
  sidebarHeader: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  mainArea: {
    flex: 1,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
});
