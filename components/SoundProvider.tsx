"use client";

import { createContext, useContext, useSyncExternalStore } from "react";

type SoundContextValue = {
  enabled: boolean;
  toggle: () => void;
};

const SoundContext = createContext<SoundContextValue>({
  enabled: true,
  toggle: () => {},
});

const STORAGE_KEY = "calcy-sound";
const CHANGE_EVENT = "calcy-sound-change";

function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  return () => window.removeEventListener(CHANGE_EVENT, callback);
}

function getSnapshot() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === null ? true : stored === "on";
}

function getServerSnapshot() {
  return true;
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const enabled = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggle = () => {
    const next = !getSnapshot();
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  return (
    <SoundContext.Provider value={{ enabled, toggle }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  return useContext(SoundContext);
}
