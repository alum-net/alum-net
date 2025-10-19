import { logout } from '@alum-net/auth';
<<<<<<< HEAD
import { Button } from 'react-native-paper';
import Screen from '../../components/screen';

export default function Profile() {
  return (
    <Screen>
      <Button mode="contained-tonal" onPress={() => logout()}>
        Cerrar sesión
      </Button>
    </Screen>
=======
import { Button, View } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Cerrar sesión" onPress={() => logout()} />
    </View>
>>>>>>> origin/main
  );
}
