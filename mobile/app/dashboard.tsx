import { useNativeLanguage } from "@/lib/native-language";
import { Redirect, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { unregisterPushNotifications } from "@/lib/push";
import { getQueueStatus } from "@/lib/offline-queue";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { language, setLanguage, copy, persistenceError } = useNativeLanguage();
  const [signOutError, setSignOutError] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { session, workspaceReady, loading } = useSession();
  const network = useNetInfo();
  const [failedUploads, setFailedUploads] = useState(0);
  const [pending, setPending] = useState<number | null>(null);
  useEffect(() => {
    let active = true;
    setPending(null);
    setFailedUploads(0);
    const refresh = () =>
      getQueueStatus()
        .then((status) => {
          if (active) {
            setPending(status.pending);
            setFailedUploads(status.failed);
          }
        })
        .catch(() => {
          if (active) {
            setPending(null);
            setFailedUploads(0);
          }
        });
    void refresh();
    const timer = setInterval(() => void refresh(), 5000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [network.isConnected, session?.user.id]);
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;
  if (!workspaceReady) return <Redirect href="/onboarding" />;
  const signOut = async () => {
    if (signingOut) return;
    setSigningOut(true);
    setSignOutError(false);
    try {
      await unregisterPushNotifications().catch(() => undefined);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch {
      setSignOutError(true);
    } finally {
      setSigningOut(false);
    }
  };
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.languageRow} accessibilityLabel={copy.language}>
        {(["de", "en"] as const).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityLabel={value === "de" ? "Deutsch" : "English"}
            accessibilityState={{ selected: value === language }}
            onPress={() => setLanguage(value)}
            style={[styles.languageButton, value === language && styles.selectedLanguage]}
          >
            <Text style={value === language ? styles.selectedLanguageText : undefined}>
              {value === "de" ? "Deutsch" : "English"}
            </Text>
          </Pressable>
        ))}
      </View>
      {persistenceError && <Text accessibilityRole="alert">{copy.sessionOnly}</Text>}
      <Text style={styles.eyebrow}>{copy.today.toUpperCase()}</Text>
      <Text style={styles.title}>{copy.title}</Text>
      <View style={[styles.sync, network.isConnected === false && styles.offline]}>
        <Text style={styles.syncText}>
          {pending === null
            ? copy.syncUnknown
            : network.isConnected === null
              ? copy.checking
              : network.isConnected === false
                ? `${copy.offline}: ${pending}`
                : pending
                  ? `${copy.queued}: ${pending}`
                  : copy.queueEmpty}
        </Text>
      </View>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/sync")}
      >
        <Text style={styles.cardTitle}>{copy.syncRecovery}</Text>
      </Pressable>
      {failedUploads > 0 && (
        <Text accessibilityRole="alert">
          {copy.queueReview}: {failedUploads}
        </Text>
      )}
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/temperature")}
      >
        <Text style={styles.cardTitle}>{copy.temperature}</Text>
        <Text style={styles.cardBody}>{copy.temperatureBody}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/checks")}
      >
        <Text style={styles.cardTitle}>{copy.checks}</Text>
        <Text style={styles.cardBody}>{copy.checksBody}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/actions")}
      >
        <Text style={styles.cardTitle}>{copy.actions}</Text>
        <Text style={styles.cardBody}>{copy.actionsBody}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/incidents")}
      >
        <Text style={styles.cardTitle}>{copy.incidents}</Text>
        <Text style={styles.cardBody}>{copy.incidentsBody}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/documents")}
      >
        <Text style={styles.cardTitle}>{copy.documents}</Text>
        <Text style={styles.cardBody}>{copy.documentsBody}</Text>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        style={styles.card}
        onPress={() => router.push("/settings")}
      >
        <Text style={styles.cardTitle}>{copy.settings}</Text>
        <Text style={styles.cardBody}>{copy.settingsBody}</Text>
      </Pressable>
      {signOutError && <Text accessibilityRole="alert">{copy.signOutError}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={signingOut}
        accessibilityState={{ disabled: signingOut, busy: signingOut }}
        onPress={signOut}
        style={styles.signOut}
      >
        <Text>{signingOut ? copy.signingOut : copy.signOut}</Text>
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: { padding: 20, paddingBottom: 40, gap: 14 },
  languageRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  languageButton: {
    minHeight: 48,
    paddingHorizontal: 16,
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#555",
    borderRadius: 10,
  },
  selectedLanguage: { backgroundColor: "#111" },
  selectedLanguageText: { color: "#fff", fontWeight: "700" },
  eyebrow: { color: "#e43f2c", fontWeight: "900", letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: "800", marginBottom: 8 },
  sync: { backgroundColor: "#dff4e7", borderRadius: 12, padding: 12 },
  offline: { backgroundColor: "#fff0c7" },
  syncText: { fontSize: 12, fontWeight: "800" },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#e5e5e5",
  },
  cardTitle: { fontSize: 20, fontWeight: "800" },
  cardBody: { color: "#666", marginTop: 5, lineHeight: 20 },
  signOut: { alignSelf: "center", padding: 16 },
});
