import {
  fetchDiscoveryAsync,
  fetchUserInfoAsync,
  makeRedirectUri,
  refreshAsync,
  RefreshTokenRequestConfig,
  revokeAsync,
} from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import {
  keycloakClientId,
  keycloakRealm,
  authScheme,
  profileScheme,
} from './constants';
import { storage, STORAGE_KEYS } from '@alum-net/storage';
import { Platform } from 'react-native';

export const refresh = async () => {
  const refreshToken = storage.getString(STORAGE_KEYS.REFRESH_TOKEN);
  const discoveryDocument = await fetchDiscoveryAsync(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
  );
  const refreshTokenObject: RefreshTokenRequestConfig = {
    clientId: keycloakClientId,
    refreshToken: refreshToken,
  };
  const { accessToken, idToken } = await refreshAsync(
    refreshTokenObject,
    discoveryDocument!,
  );
  storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  if (idToken) storage.set(STORAGE_KEYS.ID_TOKEN, idToken);
  return accessToken;
};

export const logout = async () => {
  const accessToken = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  try {
    const discoveryDocument = await fetchDiscoveryAsync(
      `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
    );
    await revokeAsync({ token: accessToken || '' }, discoveryDocument!);
    const redirectUrl = makeRedirectUri({
      native: authScheme,
    });
    const idToken = storage.getString(STORAGE_KEYS.ID_TOKEN);
    const logoutUrl = `${discoveryDocument!
      .endSessionEndpoint!}?client_id=${keycloakClientId}&post_logout_redirect_uri=${redirectUrl}&id_token_hint=${idToken}`;
    await WebBrowser.openAuthSessionAsync(logoutUrl, redirectUrl);
  } finally {
    storage.clearAll();
  }
};

export const updatePassword = async () => {
  const url = encodeURI(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}/protocol/openid-connect/auth` +
      `?client_id=${keycloakClientId}` +
      `&redirect_uri=${Platform.OS === 'web' ? `${process.env.EXPO_PUBLIC_WEB_URL}` : profileScheme}` +
      `&response_type=code` +
      `&scope=openid` +
      `&kc_action=UPDATE_PASSWORD`,
  );
  return await WebBrowser.openAuthSessionAsync(url);
};

export const getKeyclaokUserInfo = async () => {
  const accessToken = storage.getString(STORAGE_KEYS.ACCESS_TOKEN);
  if (!accessToken) {
    await logout();
    throw Error('User unauthorized');
  }
  const discoveryDocument = await fetchDiscoveryAsync(
    `${process.env.EXPO_PUBLIC_KEYCLOAK_URI}/realms/${keycloakRealm}`,
  );

  return (await fetchUserInfoAsync(
    { accessToken },
    discoveryDocument,
  )) as Promise<{
    email: string;
    email_verified: boolean;
    family_name: string;
    given_name: string;
    name: string;
    sub: string;
  }>;
};
