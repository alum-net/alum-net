import { KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { useMessaging } from '../hooks/messaging-context';
import { ChatView } from '../components/chat-view';
import { MessageInput } from '../components/message-input';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ChatScreen = () => {
  const { selectedConversation } = useMessaging();
  const insets = useSafeAreaInsets();

  return selectedConversation ? (
    <>
      <ChatView />
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={insets.top}
        style={{ width: '100%' }}
      >
        <MessageInput />
      </KeyboardAvoidingView>
    </>
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
