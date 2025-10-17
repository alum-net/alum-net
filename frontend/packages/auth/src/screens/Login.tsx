import {
  Button,
  View,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Text,
} from "react-native";
import * as WebBrowser from "expo-web-browser";
import {
  useAuthRequest,
  makeRedirectUri,
  exchangeCodeAsync,
  Prompt,
  ResponseType,
  useAutoDiscovery,
} from "expo-auth-session";
import { useMMKVString } from "react-native-mmkv";
import { storage, STORAGE_KEYS } from "@alum-net/storage";
import { useEffect, useState } from "react";
import { keycloakClientId, keycloakRealm } from "../constants";

WebBrowser.maybeCompleteAuthSession();

export function generateShortUUID() {
  return Math.random().toString(36).substring(2, 15);
}
// {
//   native: "alum-net.mobile://login",
// }
const redirectUri = makeRedirectUri();

export const LoginScreen = () => {
  const [refreshToken, setRefreshToken] = useMMKVString(
    STORAGE_KEYS.REFRESH_TOKEN,
    storage
  );
  const discovery = useAutoDiscovery(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`
  );

  const [request, response, promptAsync] = useAuthRequest(
    {
      responseType: ResponseType.Code,
      clientId: keycloakClientId,
      redirectUri: redirectUri,
      prompt: Prompt.Login,
      scopes: ["openid", "profile", "email", "offline_access"],
      usePKCE: true,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeCodeAsync(
        {
          code: code,
          clientId: keycloakClientId,
          redirectUri: redirectUri,
          extraParams: {
            code_verifier: request?.codeVerifier || "",
          },
        },
        discovery!
      )
        .then(({ accessToken, refreshToken, idToken }) => {
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          if (idToken) storage.set(STORAGE_KEYS.ID_TOKEN, idToken);
          setRefreshToken(refreshToken);
        })
        .catch((error) => console.log("Auth error", error));
    }
  }, [response]);

  useEffect(() => {
    if (request && !refreshToken) promptAsync();
  }, [promptAsync, request]);

  if (!discovery || !response)
    return (
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    );

  return (
    <View style={styles.container}>
      {!refreshToken && (
        <Button title="Iniciar sesión" onPress={() => promptAsync()} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
});
