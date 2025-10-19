import { StyleSheet, View, Text } from 'react-native';
import { Button, Surface } from 'react-native-paper';
import { THEME } from '@alum-net/ui';
import { logout, updatePassword } from '@alum-net/auth';

export function UpdateProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Actualizar Perfil</Text>
      <Surface elevation={5} style={styles.surface}>
        <Button mode="contained" onPress={updatePassword}>
          Actualizar contraseña
        </Button>
        <Button
          mode="outlined"
          onPress={logout}
          style={{ borderColor: 'red' }}
          textColor="red"
        >
          Cerrar sesión
        </Button>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    padding: 16,
    backgroundColor: THEME.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  surface: {
    padding: 16,
    backgroundColor: THEME.colors.background,
    gap: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 32,
    alignSelf: 'center',
  },
});
