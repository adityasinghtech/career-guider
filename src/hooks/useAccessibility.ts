import { useState, useCallback } from "react";

export type A11yMode = "normal" | "voice" | "blind";

const KEY = "pathfinder_a11y_mode";

function loadMode(): A11yMode {
  try { 
    const v = localStorage.getItem(KEY); 
    if (v === "normal" || v === "voice" || v === "blind") return v as A11yMode; 
  } catch {}
  return "normal";
}

export function useAccessibility() {
  const [mode, setModeState] = useState<A11yMode>(loadMode);

  const setMode = useCallback((m: A11yMode) => {
    setModeState(m);
    try { 
      localStorage.setItem(KEY, m); 
    } catch {}
  }, []);

  return { 
    mode, 
    setMode, 
    autoSpeak: mode === "blind", 
    voiceOn: mode === "voice" || mode === "blind", 
    isBlind: mode === "blind" 
  };
}
