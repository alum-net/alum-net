import { ForumThread } from '@alum-net/forums';
import Screen from '../../../../../../components/screen';
import { Appbar } from 'react-native-paper';
import { THEME } from '@alum-net/ui';
import { useRouter } from 'expo-router';

export default function ForumThreadScreen() {
  const nav = useRouter();
  return (
    <Screen scrollable={false} edges={['top']}>
      <Appbar
        safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
        style={{ backgroundColor: THEME.colors.background }}
      >
        <Appbar.BackAction onPress={nav.back} />
      </Appbar>
      <ForumThread />
    </Screen>
  );
}
