import { useEffect, useState } from "react";

export const CONSENT_KEY = "gs-cookie-consent";
export const CONSENT_VERSION = 2;
export const CONSENT_EVENT = "haccora-cookie-consent";

export type ConsentCategories = {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
};

export type ConsentRecord = ConsentCategories & {
  version: number;
  ts: number;
};

export const NECESSARY_ONLY: ConsentCategories = {
  necessary: true,
  preferences: false,
  statistics: false,
};

export const ACCEPT_ALL: ConsentCategories = {
  necessary: true,
  preferences: true,
  statistics: true,
};

export function readConsent(): ConsentRecord | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentRecord>;
    if (parsed?.version !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      preferences: Boolean(parsed.preferences),
      statistics: Boolean(parsed.statistics),
      version: CONSENT_VERSION,
      ts: typeof parsed.ts === "number" ? parsed.ts : Date.now(),
    };
  } catch {
    return null;
  }
}

export function writeConsent(categories: ConsentCategories): ConsentRecord {
  const record: ConsentRecord = {
    ...categories,
    necessary: true,
    version: CONSENT_VERSION,
    ts: Date.now(),
  };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record));
  } catch {
    /* storage unavailable — consent stays session-only */
  }
  applyConsent(record);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: record }));
  }
  return record;
}

export function clearConsent() {
  try {
    localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* noop */
  }
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
  }
}

/** Enforce the choice: drop non-essential client storage when refused. */
export function applyConsent(record: ConsentRecord) {
  if (typeof window === "undefined") return;
  const doc = document.documentElement;
  doc.dataset["consentPreferences"] = String(record.preferences);
  doc.dataset["consentStatistics"] = String(record.statistics);

  if (!record.preferences) {
    try {
      localStorage.removeItem("haccora-ui-preferences");
    } catch {
      /* noop */
    }
  }
  if (!record.statistics) {
    // remove any analytics cookies previously set on this origin
    for (const cookie of document.cookie.split(";")) {
      const name = cookie.split("=")[0]?.trim();
      if (!name) continue;
      if (/^(_ga|_gid|_gat|_hj|ph_|mp_)/.test(name)) {
        document.cookie = `${name}=; Max-Age=0; path=/`;
      }
    }
  }
}

export function openCookieSettings() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("haccora-cookie-settings"));
}

export function useCookieConsent() {
  const [consent, setConsent] = useState<ConsentRecord | null>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return consent;
}
