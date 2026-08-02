import { Redirect, router } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";
import { unregisterPushNotifications } from "@/lib/push";

export default function Dashboard() {
  const { session, workspaceReady, loading } = useSession();
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;
  if (!workspaceReady) return <Redirect href="/onboarding" />;
  const signOut = async () => {
    await unregisterPushNotifications().catch(() => undefined);
    await supabase.auth.signOut();
  };
  return (
    <ScrollView contentContainerStyle={styles.page}>
      <Text style={styles.eyebrow}>TODAY</Text>
      <Text style={styles.title}>Food safety checks</Text>
      <Pressable style={styles.card} onPress={() => router.push("/temperature")}>
        <Text style={styles.cardTitle}>Temperature</Text>
        <Text style={styles.cardBody}>Log a reading with offline retry and critical limits.</Text>
      </Pressable>
      <Pressable style={styles.card} onPress={() => router.push("/checks")}>
        <Text style={styles.cardTitle}>Daily checks</Text>
        <Text style={styles.cardBody}>
          Complete traceable opening, cleaning and closing checks.
        </Text>
      </Pressable>
      <Pressable onPress={signOut} style={styles.signOut}>
        <Text>Sign out</Text>
      </Pressable>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  page: { padding: 20, gap: 14 },
  eyebrow: { color: "#e43f2c", fontWeight: "900", letterSpacing: 2 },
  title: { fontSize: 30, fontWeight: "800", marginBottom: 8 },
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
