import {
  View,
  StyleSheet,
  ActivityIndicator,
  Image,
  TouchableOpacity,
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
import { useEffect } from "react";
import { keycloakClientId, keycloakRealm, mobileScheme } from "../constants";

WebBrowser.maybeCompleteAuthSession();

export function generateShortUUID() {
  return Math.random().toString(36).substring(2, 15);
}

const redirectUri = makeRedirectUri({
  native: mobileScheme,
});

export const LoginScreen = () => {
  const [refreshToken, setRefreshToken] = useMMKVString(
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
      scopes: ["openid", "profile", "email", "offline_access"],
      usePKCE: true,
    },
    discovery,
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
        discovery!,
      )
        .then(({ accessToken, refreshToken, idToken }) => {
          storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
          if (idToken) storage.set(STORAGE_KEYS.ID_TOKEN, idToken);
          setRefreshToken(refreshToken);
        })
        .catch((error) => console.log("Auth error", error));
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
      {!refreshToken && (
        <>
          <Image
            source={require("../assets/alumnet_logo.jpeg")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>Bienvenido de Nuevo</Text>
          <Text style={styles.subtitle}>
            Inicia sesión para continuar tu camino de aprendizaje.
          </Text>
          <TouchableOpacity style={styles.button} onPress={() => promptAsync()}>
            <Text style={styles.buttonText}>Iniciar Sesión</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  logo: {
    width: 160,
    height: 120,
    marginBottom: 40,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#aab8ff",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
});
