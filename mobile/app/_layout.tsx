import { NativeLanguageProvider, useNativeLanguage } from "@/lib/native-language";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SessionProvider } from "@/lib/session";
import { AppLockProvider } from "@/lib/app-lock";

export default function RootLayout() {
  return (
    <NativeLanguageProvider>
      <Navigator />
    </NativeLanguageProvider>
  );
}

function Navigator() {
  const { copy } = useNativeLanguage();
  return (
    <SessionProvider>
      <AppLockProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerTintColor: "#111", headerShadowVisible: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ title: "Haccora" }} />
          <Stack.Screen name="onboarding" options={{ title: copy.setup }} />
          <Stack.Screen
            name="dashboard"
            options={{ title: copy.today, headerBackVisible: false }}
          />
          <Stack.Screen name="sync" options={{ title: copy.syncRecovery }} />
          <Stack.Screen name="temperature" options={{ title: copy.temperature }} />
          <Stack.Screen name="checks" options={{ title: copy.checks }} />
          <Stack.Screen name="actions" options={{ title: copy.actions }} />
          <Stack.Screen name="incidents" options={{ title: copy.incidents }} />
          <Stack.Screen name="documents" options={{ title: copy.documents }} />
          <Stack.Screen name="settings" options={{ title: copy.settings }} />
        </Stack>
      </AppLockProvider>
    </SessionProvider>
  );
}
