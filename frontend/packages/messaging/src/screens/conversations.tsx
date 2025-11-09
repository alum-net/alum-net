import { Appbar } from 'react-native-paper';
import { ConversationsList } from '../components/conversations-list';
import { UserSearch } from '../components/user-search';
import { THEME } from '@alum-net/ui';

export const ChatListScreen = () => {
  return (
    <>
      <Appbar
        safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
        style={{ backgroundColor: THEME.colors.background }}
      >
        <Appbar.Content title="Conversaciones" />
      </Appbar>
      <UserSearch />
      <ConversationsList />
    </>
  );
};
