import { logout } from '@alum-net/auth';
import { Button, View } from 'react-native';

export default function Profile() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Cerrar sesión" onPress={() => logout()} />
    </View>
  );
}
