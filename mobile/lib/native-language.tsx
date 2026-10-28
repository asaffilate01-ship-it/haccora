import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { nativeCopy, type NativeLanguage } from "./native-copy";

const KEY = "haccora.de.native-language";
const Context = createContext<{
  language: NativeLanguage;
  setLanguage: (language: NativeLanguage) => void;
  persistenceError: boolean;
}>({ language: "de", setLanguage: () => undefined, persistenceError: false });

export function NativeLanguageProvider({ children }: { children: ReactNode }) {
  const [language, updateLanguage] = useState<NativeLanguage>("de");
  const [persistenceError, setPersistenceError] = useState(false);
  const revision = useRef(0);
  const writes = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    void AsyncStorage.getItem(KEY)
      .then((value) => {
        if (active && revision.current === 0 && (value === "de" || value === "en"))
          updateLanguage(value);
      })
      .catch(() => {
        if (active && revision.current === 0) setPersistenceError(true);
      });
    return () => {
      active = false;
    };
  }, []);
  const setLanguage = (next: NativeLanguage) => {
    const version = ++revision.current;
    updateLanguage(next);
    setPersistenceError(false);
    // Preserve click order if the user switches again before storage finishes.
    writes.current = writes.current
      .catch(() => undefined)
      .then(() => AsyncStorage.setItem(KEY, next))
      .catch(() => {
        if (version === revision.current) setPersistenceError(true);
      });
  };
  return (
    <Context.Provider value={{ language, setLanguage, persistenceError }}>
      {children}
    </Context.Provider>
  );
}

export function useNativeLanguage() {
  const state = useContext(Context);
  return { ...state, copy: nativeCopy[state.language] };
}
