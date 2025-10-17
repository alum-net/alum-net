import { Platform } from "react-native";
import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: "application",
  encryptionKey: Platform.OS === "web" ? undefined : "applicationKey",
});

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  ID_TOKEN: "idToken",
  REFRESH_TOKEN: "refreshToken",
};
