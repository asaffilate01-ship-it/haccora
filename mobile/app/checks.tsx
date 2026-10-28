import { useNativeLanguage } from "@/lib/native-language";
import { useRef, useState } from "react";
import { Redirect } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { enqueue } from "@/lib/offline-queue";
import { useSession } from "@/lib/session";

export default function Checks() {
  const { copy } = useNativeLanguage();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const { session, workspaceReady, organizationId, locationId, role, loading } = useSession();
  const pending = useRef(false);
  const save = async () => {
    if (pending.current || role === "inspector") return;
    if (!session || !workspaceReady || !organizationId || !title.trim()) return;
    pending.current = true;
    setBusy(true);
    try {
      await enqueue("checks", {
        user_id: session.user.id,
        organization_id: organizationId,
        location_id: locationId,
        kind: "daily",
        title: title.trim(),
        note: note.trim() || null,
        status: "completed",
        completed_at: new Date().toISOString(),
      });
      setTitle("");
      setNote("");
      Alert.alert(copy.queuedEvidence, copy.queuedCheckBody);
    } catch {
      Alert.alert(copy.evidenceNotSaved, copy.evidenceError);
    } finally {
      pending.current = false;
      setBusy(false);
    }
  };
  if (loading) return null;
  if (!session) return <Redirect href="/login" />;
  if (!workspaceReady) return <Redirect href="/onboarding" />;
  if (role === "inspector") return <Redirect href="/dashboard" />;
  return (
    <View style={styles.page}>
      <Text style={styles.label}>{copy.evidenceCheck}</Text>
      <TextInput
        editable={!busy}
        accessibilityLabel={copy.checkTitle}
        value={title}
        onChangeText={setTitle}
        maxLength={160}
        placeholder={copy.openingCheck}
        style={styles.input}
      />
      <Text style={styles.label}>{copy.evidenceNote}</Text>
      <TextInput
        editable={!busy}
        accessibilityLabel={copy.noteLabel}
        value={note}
        onChangeText={setNote}
        maxLength={500}
        multiline
        placeholder={copy.optionalNote}
        style={[styles.input, { minHeight: 100 }]}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy || !title.trim(), busy }}
        disabled={busy || !title.trim()}
        onPress={save}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{busy ? copy.savingEvidence : copy.completeCheck}</Text>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  page: { flex: 1, padding: 20, gap: 10 },
  label: { marginTop: 10, fontSize: 11, color: "#666", fontWeight: "800", letterSpacing: 1.5 },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
  },
  button: {
    marginTop: 18,
    backgroundColor: "#bd2b1b",
    minHeight: 48,
    borderRadius: 24,
    padding: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800" },
});
