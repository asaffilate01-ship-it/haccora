import { workspaceCacheKey, decodeWorkspaceCache } from "./workspace-cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Session } from "@supabase/supabase-js";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { supabase } from "./supabase";
import { flush, startOfflineSync } from "./offline-queue";
import { registerPushNotifications } from "./push";

type SessionContextValue = {
  session: Session | null;
  workspaceReady: boolean;
  workspaceError: boolean;
  organizationId: string | null;
  locationId: string | null;
  role: string | null;
  loading: boolean;
  refreshWorkspace: () => Promise<void>;
};
const SessionContext = createContext<SessionContextValue>({
  session: null,
  workspaceReady: false,
  workspaceError: false,
  organizationId: null,
  locationId: null,
  role: null,
  loading: true,
  refreshWorkspace: async () => undefined,
});

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const [workspaceError, setWorkspaceError] = useState(false);
  const requestVersion = useRef(0);
  const activeUser = useRef<string | null>(null);
  const [organizationId, setOrganizationId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const clearWorkspace = () => {
    setWorkspaceReady(false);
    setOrganizationId(null);
    setLocationId(null);
    setRole(null);
  };

  const loadWorkspace = async (nextSession: Session | null) => {
    const version = ++requestVersion.current;
    const userId = nextSession?.user.id ?? null;
    const previousUser = activeUser.current;
    activeUser.current = userId;
    setLoading(true);
    setWorkspaceError(false);
    if (previousUser !== userId) clearWorkspace();
    // Never read the legacy, unscoped cache. Remove it opportunistically.
    void AsyncStorage.removeItem("haccora-workspace-context-v1").catch(() => undefined);
    if (!nextSession || !userId) {
      clearWorkspace();
      if (previousUser)
        void AsyncStorage.removeItem(workspaceCacheKey(previousUser)).catch(() => undefined);
      setLoading(false);
      return;
    }
    try {
      const { data, error } = await Promise.resolve(supabase.rpc("get_my_context")).catch(() => ({
        data: null,
        error: true,
      }));
      if (version !== requestVersion.current) return;
      if (error) {
        const cached = await AsyncStorage.getItem(workspaceCacheKey(userId)).catch(() => null);
        if (version !== requestVersion.current) return;
        const decoded = decodeWorkspaceCache(cached, userId);
        const context: {
          organizationId?: string;
          locationId?: string | null;
          role?: string | null;
        } = decoded ?? {};
        setWorkspaceError(decoded === null);
        setOrganizationId(context.organizationId ?? null);
        setLocationId(context.locationId ?? null);
        setRole(context.role ?? null);
        setWorkspaceReady(typeof context.organizationId === "string");
        return;
      }
      const context = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
      const nextOrganizationId =
        typeof context.organization_id === "string" ? context.organization_id : null;
      const nextLocationId = typeof context.location_id === "string" ? context.location_id : null;
      const ready = nextOrganizationId !== null;
      const nextRole = typeof context.role === "string" ? context.role : null;
      setOrganizationId(nextOrganizationId);
      setLocationId(nextLocationId);
      setRole(nextRole);
      setWorkspaceReady(ready);
      await AsyncStorage.setItem(
        workspaceCacheKey(userId),
        JSON.stringify({
          userId,
          context: {
            organizationId: nextOrganizationId,
            locationId: nextLocationId,
            role: nextRole,
          },
        }),
      ).catch(() => undefined);
    } catch {
      if (version === requestVersion.current) {
        clearWorkspace();
        setWorkspaceError(true);
      }
    } finally {
      if (version === requestVersion.current) setLoading(false);
    }
  };

  const refreshWorkspace = async () => loadWorkspace(session);

  useEffect(() => {
    let active = true;
    let authChanged = false;
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        if (!active || authChanged) return;
        setSession(data.session);
        await loadWorkspace(data.session);
        if (!active || authChanged) return;
        if (data.session) {
          void flush().catch(() => undefined);
          void registerPushNotifications().catch(() => undefined);
        }
      })
      .catch(() => {
        if (active && !authChanged) setLoading(false);
      });
    const { data } = supabase.auth.onAuthStateChange((_event, next) => {
      authChanged = true;
      setSession(next);
      void loadWorkspace(next).then(() => {
        if (active && next && activeUser.current === next.user.id) {
          void flush().catch(() => undefined);
          void registerPushNotifications().catch(() => undefined);
        }
      });
    });
    const stopOfflineSync = startOfflineSync();
    return () => {
      active = false;
      requestVersion.current++;
      data.subscription.unsubscribe();
      stopOfflineSync();
    };
  }, []);
  return (
    <SessionContext.Provider
      value={{
        session,
        workspaceReady,
        workspaceError,
        organizationId,
        locationId,
        role,
        loading,
        refreshWorkspace,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export const useSession = () => useContext(SessionContext);
