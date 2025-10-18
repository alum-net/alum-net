import { logout } from '@alum-net/auth';
import { View } from 'react-native';
import { Button } from 'react-native-paper';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button mode="contained-tonal" onPress={() => logout()}>
        Cerrar sesión
      </Button>
    </View>
  );
}
