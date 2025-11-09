import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { useMessaging } from '../hooks/messaging-context';
import { ChatView } from '../components/chat-view';
import { MessageInput } from '../components/message-input';

export const ChatScreen = () => {
  const { selectedConversation } = useMessaging();

  return selectedConversation ? (
    <KeyboardAvoidingView
      style={{
        flex: 1,
        width: '100%',
      }}
    >
      <ChatView />
      <MessageInput />
    </KeyboardAvoidingView>
  ) : (
    <View style={styles.emptyState}>
      <Text style={styles.emptyText}>
        Selecciona una conversación para ver los mensajes
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});
