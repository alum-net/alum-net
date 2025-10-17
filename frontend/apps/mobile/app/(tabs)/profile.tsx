import { Button, View } from "react-native";
import { useAuth } from "@alum-net/auth";

export default function Profile() {
  const { logout } = useAuth();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
}
