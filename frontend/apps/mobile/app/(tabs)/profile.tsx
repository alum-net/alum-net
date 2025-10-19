import { logout } from '@alum-net/auth';
import { Button } from 'react-native-paper';
import Screen from '../../components/screen';

export default function Profile() {
  return (
    <Screen>
      <Button mode="contained-tonal" onPress={() => logout()}>
        Cerrar sesión
      </Button>
    </Screen>
  );
}
