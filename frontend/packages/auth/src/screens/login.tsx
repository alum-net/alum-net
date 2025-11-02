import { View, StyleSheet, ActivityIndicator, Image, Text } from 'react-native';
import { Button } from 'react-native-paper';
import * as WebBrowser from 'expo-web-browser';
import {
  useAuthRequest,
  makeRedirectUri,
  exchangeCodeAsync,
  Prompt,
  ResponseType,
  useAutoDiscovery,
} from 'expo-auth-session';
import { useMMKVString } from 'react-native-mmkv';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { useEffect } from 'react';
import { keycloakClientId, keycloakRealm, authScheme } from '../constants';

WebBrowser.maybeCompleteAuthSession();

const redirectUri = makeRedirectUri({
  native: authScheme,
});

export const LoginScreen = () => {
  const [, setRefreshToken] = useMMKVString(
    STORAGE_KEYS.REFRESH_TOKEN,
    storage,
  );
  const discovery = useAutoDiscovery(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
  );
  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: keycloakClientId,
      redirectUri: redirectUri,
      prompt: Prompt.Login,
      scopes: ['openid', 'email'],
      usePKCE: true,
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      exchangeCodeAsync(
        {
          code: code,
          clientId: keycloakClientId,
          redirectUri: redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || '',
          },
        },
        discovery!,
      ).then(({ accessToken, refreshToken, idToken }) => {
        storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
        if (idToken) storage.set(STORAGE_KEYS.ID_TOKEN, idToken);
        setRefreshToken(refreshToken);
      });
    }
  }, [response, discovery, request, setRefreshToken]);

  if (!discovery)
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      <Image
        source={require('@alum-net/ui/src/assets/alumnet_logo.jpeg')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bienvenido de Nuevo</Text>
      <Text style={styles.subtitle}>
        Inicia sesión para continuar tu camino de aprendizaje.
      </Text>
      <Button
        onPress={() => {
          promptAsync();
        }}
        mode="contained"
      >
        Iniciar sesión
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 30,
  },
});
