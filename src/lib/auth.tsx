import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Role = "owner" | "manager" | "chef" | "staff" | "inspector";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: Role;
  location: string;
}

const NAV_KEYS = ["dashboard","haccp","checks","temperature","cleaning","routines","menu","rota","waste","stock","recipes","suppliers","purchasing","assets","recalls","audits","training","labels","incidents","alerts","expiry","documents","logs","audit","settings","goodsin","calibration","health","pest","oil","complaints","chemicals"] as const;
export type NavKey = typeof NAV_KEYS[number];

export const ROLE_PERMISSIONS: Record<Role, NavKey[]> = {
  owner:     ["dashboard","haccp","checks","temperature","cleaning","routines","menu","rota","waste","stock","recipes","suppliers","purchasing","assets","recalls","audits","training","labels","incidents","alerts","expiry","documents","logs","audit","settings","goodsin","calibration","health","pest","oil","complaints","chemicals"],
  manager:   ["dashboard","haccp","checks","temperature","cleaning","routines","menu","rota","waste","stock","recipes","suppliers","purchasing","assets","recalls","audits","training","labels","incidents","alerts","expiry","documents","logs","audit","settings","goodsin","calibration","health","pest","oil","complaints","chemicals"],
  chef:      ["dashboard","haccp","checks","temperature","cleaning","routines","menu","waste","stock","recipes","purchasing","assets","recalls","training","labels","incidents","alerts","expiry","documents","settings","goodsin","calibration","pest","oil","complaints","chemicals"],
  staff:     ["dashboard","checks","temperature","cleaning","routines","rota","waste","training","labels","incidents","alerts","expiry","goodsin","calibration","pest","oil"],
  inspector: ["dashboard","documents","logs","audit","audits","recalls","incidents","goodsin","calibration","health","pest","oil","complaints","chemicals"],
};

export function canAccess(role: Role, key: NavKey) { return ROLE_PERMISSIONS[role].includes(key); }
export function homeFor(role: Role): string { return role === "inspector" ? "/app/inspection" : "/app"; }

function initialsOf(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase() ?? "").join("") || "GS";
}

async function fetchAuthUser(userId: string, email: string): Promise<AuthUser | null> {
  const [{ data: profile }, { data: roleRow }] = await Promise.all([
    supabase.from("profiles").select("full_name, location, restaurant_name").eq("id", userId).maybeSingle(),
    supabase.from("user_roles").select("role").eq("user_id", userId).order("created_at", { ascending: true }).limit(1).maybeSingle(),
  ]);
  const name = profile?.full_name || email.split("@")[0];
  const role = (roleRow?.role ?? "staff") as Role;
  const location = profile?.location || profile?.restaurant_name || "Haccora";
  return { id: userId, name, email, initials: initialsOf(name), role, location };
}

type Ctx = {
  user: AuthUser | null;
  hydrated: boolean;
  signInWithEmail: (email: string, password: string) => Promise<{ error?: string }>;
  signUpWithEmail: (input: { email: string; password: string; name: string; role: Role; restaurant?: string }) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const loadFromSession = async () => {
    const { data } = await supabase.auth.getSession();
    const s = data.session;
    if (!s?.user) { setUser(null); return; }
    const u = await fetchAuthUser(s.user.id, s.user.email ?? "");
    setUser(u);
  };

  useEffect(() => {
    // Listener first, then hydrate
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) { setUser(null); return; }
      if (session.user) {
        // defer to avoid blocking the callback
        setTimeout(() => { fetchAuthUser(session.user.id, session.user.email ?? "").then(setUser); }, 0);
      }
    });
    loadFromSession().finally(() => setHydrated(true));
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return {};
  };

  const signUpWithEmail: Ctx["signUpWithEmail"] = async ({ email, password, name, role, restaurant }) => {
    const redirectTo = typeof window !== "undefined" ? `${window.location.origin}/app` : undefined;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: name, role, restaurant_name: restaurant ?? null },
      },
    });
    if (error) return { error: error.message };
    return {};
  };

  const signOut = async () => { await supabase.auth.signOut(); setUser(null); };
  const refresh = async () => { await loadFromSession(); };

  return (
    <AuthContext.Provider value={{ user, hydrated, signInWithEmail, signUpWithEmail, signOut, refresh }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const ROLES: Role[] = ["owner","manager","chef","staff","inspector"];
