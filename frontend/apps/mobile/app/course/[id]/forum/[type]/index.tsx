import { ForumPostList } from '@alum-net/forums';
import Screen from '../../../../../components/screen';
import { Appbar } from 'react-native-paper';
import { THEME } from '@alum-net/ui';
import { useNavigation } from 'expo-router';

export default function ForumScreen() {
  const nav = useNavigation();
  return (
    <Screen edges={['top', 'bottom']} scrollable={false}>
      <Appbar
        safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
        style={{ backgroundColor: THEME.colors.background }}
      >
        <Appbar.BackAction onPress={nav.goBack} />
      </Appbar>
      <ForumPostList />
    </Screen>
  );
}
