import { useState, useCallback, useEffect, useRef } from 'react';

interface SpeakOptions {
  rate?: number;
  pitch?: number;
  lang?: string;
  onEnd?: () => void;
}

export function useTextToSpeech() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const voicesRef = useRef<SpeechSynthesisVoice[]>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTextRef = useRef<string>("");

  useEffect(() => {
    if (!('speechSynthesis' in window)) return;
    setSupported(true);
    const loadVoices = () => {
      const v = window.speechSynthesis.getVoices();
      if (v.length > 0) voicesRef.current = v;
    };
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
    const timer = setInterval(() => {
      if (voicesRef.current.length === 0) loadVoices();
      else clearInterval(timer);
    }, 1000);
    return () => {
      window.speechSynthesis.cancel();
      clearInterval(timer);
    };
  }, []);

  const stripEmoji = (text: string): string => {
    return text.replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, '').trim();
  };

  const testSound = useCallback(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioCtx.close();
      }, 500);
      console.log("🔊 Beep triggered via Web Audio API");
    } catch (e) {
      console.error("🚨 Web Audio API Error:", e);
    }
  }, []);

  const speak = useCallback(
    (text: string, options?: SpeakOptions) => {
      const cleanText = stripEmoji(text);
      if (!cleanText || !('speechSynthesis' in window)) return;

      lastTextRef.current = text;
      
      // ✅ PHASE 22: High-Speed & Hindi Focus
      window.speechSynthesis.resume();
      window.speechSynthesis.cancel();

      // Faster delay (50ms) to ensure queue clearing
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        const voices = voicesRef.current;
        
        // Priority: Local Hindi -> ANY Hindi -> ANY Local -> Default
        const selectedVoice = 
          voices.find((v) => v.lang.startsWith('hi') && v.localService) ||
          voices.find((v) => v.lang.startsWith('hi')) ||
          voices.find((v) => v.localService) ||
          voices[0];
        
        if (selectedVoice) {
          utterance.voice = selectedVoice;
          utterance.lang = selectedVoice.lang;
        }

        utterance.rate = 0.95; 
        utterance.pitch = 1;
        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
          setIsSpeaking(false);
          options?.onEnd?.();
        };
        utterance.onerror = () => setIsSpeaking(false);

        window.speechSynthesis.speak(utterance);
      }, 50);
    },
    []
  );

  const initVoice = useCallback((initialText?: string) => {
    testSound(); // Always beep to confirm hardware and context unlock
    if (initialText) speak(initialText);
  }, [testSound, speak]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    if (audioRef.current) audioRef.current.pause();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, initVoice, isSpeaking, supported, voiceCount: voicesRef.current.length, testSound };
}
