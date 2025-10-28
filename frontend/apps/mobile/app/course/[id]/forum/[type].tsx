import { ForumPostList } from '@alum-net/forums';
import Screen from '../../../../components/screen';
import { FAB } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import { THEME } from '@alum-net/ui';
import { useNavigation } from 'expo-router';

export default function ForumScreen() {
  const nav = useNavigation();
  return (
    <Screen edges={['top', 'bottom']} scrollable={false}>
      <ForumPostList />
      <FAB
        icon="keyboard-backspace"
        label="Volver"
        style={styles.fab}
        mode="flat"
        onPress={() => nav.goBack()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    left: 30,
    bottom: 24,
    backgroundColor: 'white',
    borderColor: THEME.colors.secondary,
    borderWidth: 1,
  },
});
