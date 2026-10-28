import { useNativeLanguage } from "@/lib/native-language";
import { Redirect } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useSession } from "@/lib/session";
import { supabase } from "@/lib/supabase";

export default function Onboarding() {
  const { copy } = useNativeLanguage();
  const { session, workspaceReady, workspaceError, loading, refreshWorkspace } = useSession();
  const [business, setBusiness] = useState("");
  const [location, setLocation] = useState("");
  const [busy, setBusy] = useState(false);
  const pending = useRef(false);

  const createWorkspace = async () => {
    if (pending.current || workspaceError) return;
    if (business.trim().length < 2 || !location.trim()) {
      Alert.alert(copy.formRequired, copy.namesRequired);
      return;
    }
    pending.current = true;
    setBusy(true);
    try {
      const { error } = await supabase.rpc("bootstrap_my_organization", {
        p_name: business.trim(),
        p_location_name: location.trim(),
      });
      if (error) throw error;
      await refreshWorkspace();
    } catch {
      Alert.alert(copy.setupFailed, copy.setupError);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };

  if (loading)
    return (
      <View style={styles.page}>
        <Text>{copy.checkingAccess}</Text>
      </View>
    );
  if (!session) return <Redirect href="/login" />;
  if (workspaceReady) return <Redirect href="/dashboard" />;
  if (workspaceError)
    return (
      <View style={styles.page}>
        <Text accessibilityRole="alert">{copy.workspaceUnavailable}</Text>
        <Pressable
          accessibilityRole="button"
          style={styles.button}
          onPress={() => void refreshWorkspace()}
        >
          <Text style={styles.buttonText}>{copy.retry}</Text>
        </Pressable>
      </View>
    );
  return (
    <View style={styles.page}>
      <Text style={styles.title}>{copy.createTitle}</Text>
      <Text style={styles.body}>{copy.createBody}</Text>
      <TextInput
        value={business}
        onChangeText={setBusiness}
        maxLength={160}
        accessibilityLabel={copy.businessName}
        placeholder={copy.businessName}
        style={styles.input}
      />
      <TextInput
        value={location}
        onChangeText={setLocation}
        maxLength={160}
        accessibilityLabel={copy.locationName}
        placeholder={copy.locationName}
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        disabled={busy}
        onPress={createWorkspace}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{busy ? copy.creating : copy.createWorkspace}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 24, gap: 14, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "800", color: "#111" },
  body: { color: "#666", lineHeight: 21, marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#d8d8d8", borderRadius: 12, padding: 14 },
  button: {
    backgroundColor: "#bd2b1b",
    minHeight: 48,
    borderRadius: 24,
    padding: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },
});
