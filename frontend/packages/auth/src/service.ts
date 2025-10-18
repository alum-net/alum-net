import {
  fetchDiscoveryAsync,
  makeRedirectUri,
  refreshAsync,
  RefreshTokenRequestConfig,
  revokeAsync,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { keycloakClientId, keycloakRealm, mobileScheme } from './constants';
import { storage, STORAGE_KEYS } from '@alum-net/storage';

export const refresh = async () => {
  const refreshToken = storage.getString(STORAGE_KEYS.REFRESH_TOKEN);
  const discoveryDocument = await fetchDiscoveryAsync(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
  );
  const refreshTokenObject: RefreshTokenRequestConfig = {
    clientId: keycloakClientId,
    refreshToken: refreshToken,
  };
  try {
    const { accessToken, idToken } = await refreshAsync(
      refreshTokenObject,
      discoveryDocument!,
    );
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    if (idToken) storage.set(STORAGE_KEYS.ID_TOKEN, idToken);
    return accessToken;
  } catch (error) {
    console.log(error);
    logout();
  }
};

export const logout = async () => {
  const accessToken = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) return;
  const discoveryDocument = await fetchDiscoveryAsync(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
  );
  const revoked = await revokeAsync({ token: accessToken }, discoveryDocument!);
  if (!revoked) return;
  const redirectUrl = makeRedirectUri({
    native: mobileScheme,
  });
  const idToken = storage.getString(STORAGE_KEYS.ID_TOKEN);
  const logoutUrl = `${discoveryDocument!
    .endSessionEndpoint!}?client_id=${keycloakClientId}&post_logout_redirect_uri=${redirectUrl}&id_token_hint=${idToken}`;

  const res = await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUrl);
  if (res.type === 'success') {
    storage.clearAll();
  }
};
