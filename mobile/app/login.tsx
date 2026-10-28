import { useNativeLanguage } from "@/lib/native-language";
import { Redirect, router } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { supabase } from "@/lib/supabase";
import { useSession } from "@/lib/session";

export default function Login() {
  const { copy, language, setLanguage, persistenceError } = useNativeLanguage();
  const { session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);
  const [error, setError] = useState(false);
  if (session) return <Redirect href="/dashboard" />;
  const submit = async () => {
    if (submitting.current || !email.trim() || !password) return;
    submitting.current = true;
    setBusy(true);
    setError(false);
    try {
      const { error: failure } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (failure) throw failure;
      router.replace("/");
    } catch {
      setError(true);
    } finally {
      submitting.current = false;
      setBusy(false);
    }
  };
  return (
    <View style={styles.page}>
      <Text style={styles.brand}>HACCORA</Text>
      <View style={{ flexDirection: "row", gap: 16 }}>
        {(["de", "en"] as const).map((value) => (
          <Pressable
            key={value}
            accessibilityRole="button"
            accessibilityState={{ selected: language === value }}
            onPress={() => setLanguage(value)}
            style={{ minHeight: 48, justifyContent: "center" }}
          >
            <Text style={{ fontWeight: language === value ? "800" : "400" }}>
              {value === "de" ? "Deutsch" : "English"}
            </Text>
          </Pressable>
        ))}
      </View>
      {persistenceError && <Text accessibilityRole="alert">{copy.sessionOnly}</Text>}
      <Text style={styles.title}>{copy.loginTitle}</Text>
      <TextInput
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        accessibilityLabel={copy.email}
        placeholder={copy.email}
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        autoCapitalize="none"
        autoComplete="current-password"
        secureTextEntry
        accessibilityLabel={copy.password}
        placeholder={copy.password}
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      {error && <Text accessibilityRole="alert">{copy.loginError}</Text>}
      <Pressable
        accessibilityRole="button"
        disabled={busy || !email.trim() || !password}
        accessibilityState={{ disabled: busy || !email.trim() || !password, busy }}
        onPress={submit}
        style={styles.button}
      >
        <Text style={styles.buttonText}>{busy ? copy.signingIn : copy.signIn}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", padding: 24, gap: 14, backgroundColor: "#fff" },
  brand: { color: "#e43f2c", fontSize: 14, fontWeight: "900", letterSpacing: 2 },
  title: { color: "#111", fontSize: 30, fontWeight: "800", marginBottom: 18 },
  input: { borderWidth: 1, borderColor: "#d8d8d8", borderRadius: 12, padding: 14, fontSize: 16 },
  button: {
    backgroundColor: "#bd2b1b",
    minHeight: 48,
    borderRadius: 24,
    padding: 15,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "800", fontSize: 16 },
});
