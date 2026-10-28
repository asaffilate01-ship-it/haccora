import { useNativeLanguage } from "@/lib/native-language";
import { decimalInput } from "@/lib/evidence-input";
import { useRef, useState } from "react";
import { Redirect } from "expo-router";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { enqueue } from "@/lib/offline-queue";
import { useSession } from "@/lib/session";

export default function Temperature() {
  const { copy } = useNativeLanguage();
  const [location, setLocation] = useState("");
  const [reading, setReading] = useState("");
  const [targetMin, setTargetMin] = useState("0");
  const [targetMax, setTargetMax] = useState("7");
  const [busy, setBusy] = useState(false);
  const { session, workspaceReady, organizationId, locationId, role, loading } = useSession();
  const pending = useRef(false);
  const save = async () => {
    if (pending.current || role === "inspector") return;
    const value = decimalInput(reading);
    const min = decimalInput(targetMin);
    const max = decimalInput(targetMax);
    if (
      !session ||
      !workspaceReady ||
      !organizationId ||
      !location.trim() ||
      value === null ||
      min === null ||
      max === null ||
      value < -100 ||
      value > 300 ||
      min < -100 ||
      max > 300 ||
      min >= max
    )
      return Alert.alert(copy.checkValues, copy.valuesRequired);
    pending.current = true;
    setBusy(true);
    try {
      await enqueue("temperature_logs", {
        user_id: session.user.id,
        organization_id: organizationId,
        location_id: locationId,
        location: location.trim(),
        reading: value,
        target_min: min,
        target_max: max,
        logged_at: new Date().toISOString(),
      });
      setReading("");
      Alert.alert(copy.queuedEvidence, copy.queuedReadingBody);
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
      <Text style={styles.label}>{copy.unitLabel}</Text>
      <TextInput
        editable={!busy}
        accessibilityLabel={copy.unitInput}
        value={location}
        onChangeText={setLocation}
        maxLength={160}
        placeholder={copy.fridgeExample}
        style={styles.input}
      />
      <View style={styles.limits}>
        <View style={styles.limit}>
          <Text style={styles.label}>{copy.minLabel}</Text>
          <TextInput
            editable={!busy}
            accessibilityLabel={copy.minInput}
            value={targetMin}
            onChangeText={setTargetMin}
            keyboardType="decimal-pad"
            placeholder="0"
            style={styles.input}
          />
        </View>
        <View style={styles.limit}>
          <Text style={styles.label}>{copy.maxLabel}</Text>
          <TextInput
            editable={!busy}
            accessibilityLabel={copy.maxInput}
            value={targetMax}
            onChangeText={setTargetMax}
            keyboardType="decimal-pad"
            placeholder="7"
            style={styles.input}
          />
        </View>
      </View>
      <Text style={styles.label}>{copy.readingLabel}</Text>
      <TextInput
        editable={!busy}
        accessibilityLabel={copy.readingInput}
        value={reading}
        onChangeText={setReading}
        keyboardType="decimal-pad"
        placeholder="4.2"
        style={styles.input}
      />
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ disabled: busy, busy }}
        disabled={busy}
        onPress={save}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{busy ? copy.savingEvidence : copy.saveReading}</Text>
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
    fontSize: 18,
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
  limits: { flexDirection: "row", gap: 10 },
  limit: { flex: 1 },
});
