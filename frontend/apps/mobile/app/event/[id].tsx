import { Appbar } from 'react-native-paper';
import Screen from '../../components/screen';
import { EventDetails } from '@alum-net/courses';
import { useNavigation } from 'expo-router';
import { THEME } from '@alum-net/ui';

export default function Event() {
  const nav = useNavigation();
  return (
    <Screen edges={['top']}>
      <Appbar
        safeAreaInsets={{ bottom: 0, top: 0, left: 0, right: 0 }}
        style={{ backgroundColor: THEME.colors.background }}
      >
        <Appbar.BackAction onPress={nav.goBack} />
      </Appbar>
      <EventDetails />
    </Screen>
  );
}
