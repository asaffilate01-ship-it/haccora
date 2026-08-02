import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/lib/session";

export default function RootLayout() {
  return (
    <SessionProvider>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerTintColor: "#111", headerShadowVisible: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ title: "Haccora" }} />
        <Stack.Screen name="onboarding" options={{ title: "Set up workspace" }} />
        <Stack.Screen name="dashboard" options={{ title: "Today", headerBackVisible: false }} />
        <Stack.Screen name="temperature" options={{ title: "Temperature check" }} />
        <Stack.Screen name="checks" options={{ title: "Daily check" }} />
      </Stack>
    </SessionProvider>
  );
}
