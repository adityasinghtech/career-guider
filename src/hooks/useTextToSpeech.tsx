import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeakOptions {
  rate?: number;   // 0.5 (slow) to 2 (fast)
  pitch?: number;  // 0 to 2
  lang?: string;   // 'hi-IN' ya 'en-IN'
  onEnd?: () => void;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);

  // Browser support check + voices preload
  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    setSupported(true);

    const loadVoices = () => {
      voicesRef.current = window.speechSynthesis.getVoices();
    };

    // Voices async load hoti hain — event bhi sunna padta hai
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      if (!('speechSynthesis' in window)) return;

      // Pehle sab kuch band karo
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = options?.lang || 'hi-IN';
      utterance.rate = options?.rate ?? 0.9; // Thoda slow — samajh aaye
      utterance.pitch = options?.pitch ?? 1;

      // Hindi voice prefer karo, fallback to en-IN
      const voices = voicesRef.current;
      const hindiVoice =
        voices.find((v) => v.lang === 'hi-IN') ||
        voices.find((v) => v.lang.startsWith('hi')) ||
        voices.find((v) => v.lang === 'en-IN') ||
        null;

      if (hindiVoice) utterance.voice = hindiVoice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        options?.onEnd?.();
      };
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    []
  );

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking, supported };
}
