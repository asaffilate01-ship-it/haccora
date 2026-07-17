import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "owner" | "manager" | "chef" | "staff" | "inspector";

export interface AuthUser {
  name: string;
  email: string;
  initials: string;
  role: Role;
  location: string;
}

const DEMO_USERS: Record<Role, AuthUser> = {
  owner:     { name: "Anna Weber",   email: "anna@kreuzberg-kitchen.de", initials: "AW", role: "owner",     location: "Kreuzberg Kitchen · HQ" },
  manager:   { name: "Marta Kowal",  email: "marta@kreuzberg-kitchen.de",initials: "MK", role: "manager",   location: "Kreuzberg Kitchen" },
  chef:      { name: "Omar El-Sayed",email: "omar@kreuzberg-kitchen.de", initials: "OE", role: "chef",      location: "Kreuzberg Kitchen · Küche" },
  staff:     { name: "Aylin Yılmaz", email: "aylin@kreuzberg-kitchen.de",initials: "AY", role: "staff",     location: "Kreuzberg Kitchen · Service" },
  inspector: { name: "Dr. K. Braun", email: "kbraun@ba-fk.berlin.de",    initials: "KB", role: "inspector", location: "Bezirksamt Friedrichshain-Kreuzberg" },
};

const NAV_KEYS = ["dashboard","haccp","checks","temperature","cleaning","recipes","suppliers","training","audit"] as const;
export type NavKey = typeof NAV_KEYS[number];

export const ROLE_PERMISSIONS: Record<Role, NavKey[]> = {
  owner:     ["dashboard","haccp","checks","temperature","cleaning","recipes","suppliers","training","audit"],
  manager:   ["dashboard","haccp","checks","temperature","cleaning","recipes","suppliers","training","audit"],
  chef:      ["dashboard","haccp","checks","temperature","cleaning","recipes","training"],
  staff:     ["dashboard","checks","temperature","cleaning","training"],
  inspector: ["dashboard","audit"],
};

export function canAccess(role: Role, key: NavKey) {
  return ROLE_PERMISSIONS[role].includes(key);
}

type Ctx = {
  user: AuthUser | null;
  signIn: (role: Role) => void;
  signOut: () => void;
  hydrated: boolean;
};
const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("gs-auth");
      if (raw) {
        const role = raw as Role;
        if (DEMO_USERS[role]) setUser(DEMO_USERS[role]);
      }
    } catch { /* noop */ }
    setHydrated(true);
  }, []);

  const signIn = (role: Role) => {
    setUser(DEMO_USERS[role]);
    try { localStorage.setItem("gs-auth", role); } catch { /* noop */ }
  };
  const signOut = () => {
    setUser(null);
    try { localStorage.removeItem("gs-auth"); } catch { /* noop */ }
  };

  return <AuthContext.Provider value={{ user, signIn, signOut, hydrated }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export const ROLES: Role[] = ["owner","manager","chef","staff","inspector"];
