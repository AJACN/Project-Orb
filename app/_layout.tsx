import { Stack } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
  return (
    // Envelopamos toda a aplicação com o Provider
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </SafeAreaProvider>
  );
}